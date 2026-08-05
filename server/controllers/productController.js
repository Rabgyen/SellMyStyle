const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);
const beginTransaction = util.promisify(db.beginTransaction).bind(db);
const commit = util.promisify(db.commit).bind(db);
const rollback = util.promisify(db.rollback).bind(db);

const deactivateExpiredDiscounts = () => query(
    "UPDATE discounts SET is_active = 0 WHERE is_active = 1 AND end_date <= CURRENT_DATE()"
);

exports.deactivateExpiredDiscounts = deactivateExpiredDiscounts;

const toDateKey = (value) => {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

const sanitizeDiscount = (product) => {
    const today = toDateKey(new Date());
    const startDate = toDateKey(product.start_date);
    const endDate = toDateKey(product.end_date);
    const discountIsCurrent = Number(product.is_active) === 1
        && Number(product.discount_percentage) > 0
        && startDate
        && endDate
        && startDate <= today
        && today < endDate;

    if (discountIsCurrent) return product;

    return {
        ...product,
        discount_percentage: null,
        start_date: null,
        end_date: null,
        is_active: 0
    };
};

exports.getProductCategory = (req, res) => {
    const sql = "SELECT * FROM categories";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database Error",
                error: err
            });
        }

        res.status(200).json(result);
    });
};

exports.addProduct = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const {
            name,
            description,
            category_id,
            price,
            original_price,
            stock_quantity,
            brand,
            size,
            color,
            condition,
            material,
            season,
            length,
            width,
            fit
        } = req.body;

        if (!sellerId) {
            return res.status(400).json({ success: false, message: "sellerId is required" });
        }

        if (!name || !category_id || !price || stock_quantity === undefined || stock_quantity === null) {
            return res.status(400).json({
                success: false,
                message: "name, category, price, and stock quantity are required"
            });
        }

        const files = req.files || [];
        if (!files.length) {
            return res.status(400).json({ success: false, message: "At least one product image is required" });
        }

        let resolvedCategoryId = category_id;
        if (Number.isNaN(Number(resolvedCategoryId))) {
            const categoryRows = await query(
                "SELECT category_id FROM categories WHERE category_name = ? LIMIT 1",
                [category_id]
            );

            if (!categoryRows.length) {
                return res.status(400).json({ success: false, message: "Invalid category" });
            }

            resolvedCategoryId = categoryRows[0].category_id;
        }

        const now = new Date();
        const productPrice = Number(price);
        const productOriginalPrice = original_price !== undefined && original_price !== "" ? Number(original_price) : null;
        const productStockQuantity = Number(stock_quantity);
        const productLength = length !== undefined && length !== "" ? Number(length) : null;
        const productWidth = width !== undefined && width !== "" ? Number(width) : null;

        await beginTransaction();

        const productResult = await query(
            `INSERT INTO products
             (seller_id, category_id, product_name, description, price, original_price, stock_quantity, brand, size, product_condition, color, material, season, length, width, fit, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sellerId,
                resolvedCategoryId,
                name,
                description || null,
                productPrice,
                productOriginalPrice,
                productStockQuantity,
                brand || null,
                size || null,
                condition || null,
                color || null,
                material || null,
                season || null,
                productLength,
                productWidth,
                fit || null,
                now,
                now
            ]
        );

        const productId = productResult.insertId;

        for (let index = 0; index < files.length; index += 1) {
            const file = files[index];
            await query(
                `INSERT INTO product_images (product_id, image_path, display_order, uploaded_at)
                 VALUES (?, ?, ?, ?)`,
                [productId, `/uploads/${file.filename}`, index + 1, now]
            );
        }

        await commit();

        res.status(201).json({
            success: true,
            message: "Product posted successfully",
            productId
        });
    } catch (error) {
        try {
            await rollback();
        } catch (rollbackError) {
            console.error("Rollback error in addProduct:", rollbackError);
        }

        console.error("Error in addProduct:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate that productId is a number
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        await deactivateExpiredDiscounts();

        const sql = `
            SELECT 
                p.*,
                c.category_name,
                pi.image_path,
                s.store_name,
                s.store_logo,
                u.user_id,
                (SELECT d.discount_percentage FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS discount_percentage,
                (SELECT d.start_date FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS start_date,
                (SELECT d.end_date FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS end_date,
                (SELECT d.is_active FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS is_active
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.display_order = 1
            LEFT JOIN seller_profiles s ON p.seller_id = s.seller_id
            LEFT JOIN users u ON u.user_id = s.user_id
            WHERE p.product_id = ?
        `;

        const result = await query(sql, [productId]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const product = sanitizeDiscount(result[0]);

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error in getProductById:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {
            name,
            description,
            category_id,
            price,
            original_price,
            stock_quantity,
            brand,
            size,
            color,
            condition,
            material,
            season,
            length,
            width,
            fit,
            discount_percentage,
            start_date,
            end_date,
            is_active
        } = req.body;

        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (!name || !category_id || price === undefined || price === null || price === "" || stock_quantity === undefined || stock_quantity === null || stock_quantity === "") {
            return res.status(400).json({
                success: false,
                message: "name, category, price, and stock quantity are required"
            });
        }

        const hasDiscount = discount_percentage !== undefined && discount_percentage !== null && discount_percentage !== "";
        if (hasDiscount) {
            const percentage = Number(discount_percentage);
            if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
                return res.status(400).json({ success: false, message: "Discount percentage must be between 0 and 100" });
            }
            if (!start_date || !end_date) {
                return res.status(400).json({ success: false, message: "A discount start date and end date are required" });
            }
            if (new Date(start_date) > new Date(end_date)) {
                return res.status(400).json({ success: false, message: "Discount end date must be on or after its start date" });
            }
        }

        const existingRows = await query("SELECT product_id FROM products WHERE product_id = ? LIMIT 1", [productId]);
        if (!existingRows.length) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let resolvedCategoryId = category_id;
        if (resolvedCategoryId !== undefined && resolvedCategoryId !== null && resolvedCategoryId !== "") {
            if (Number.isNaN(Number(resolvedCategoryId))) {
                const categoryRows = await query(
                    "SELECT category_id FROM categories WHERE category_name = ? LIMIT 1",
                    [category_id]
                );

                if (!categoryRows.length) {
                    return res.status(400).json({ success: false, message: "Invalid category" });
                }

                resolvedCategoryId = categoryRows[0].category_id;
            }
        }

        const updates = {
            product_name: name,
            description: description || null,
            category_id: resolvedCategoryId !== undefined && resolvedCategoryId !== "" ? resolvedCategoryId : undefined,
            price: price !== undefined && price !== "" ? Number(price) : undefined,
            original_price: original_price !== undefined && original_price !== "" ? Number(original_price) : null,
            stock_quantity: stock_quantity !== undefined && stock_quantity !== "" ? Number(stock_quantity) : undefined,
            brand: brand || null,
            size: size || null,
            product_condition: condition || null,
            color: color || null,
            material: material || null,
            season: season || null,
            length: length !== undefined && length !== "" ? Number(length) : null,
            width: width !== undefined && width !== "" ? Number(width) : null,
            fit: fit || null,
            updated_at: new Date()
        };

        const updateSql = `
            UPDATE products
            SET product_name = ?, description = ?, category_id = ?, price = ?, original_price = ?, stock_quantity = ?,
                brand = ?, size = ?, product_condition = ?, color = ?, material = ?, season = ?, length = ?, width = ?, fit = ?, updated_at = ?
            WHERE product_id = ?
        `;

        await beginTransaction();

        await query(updateSql, [
            updates.product_name,
            updates.description,
            updates.category_id,
            updates.price,
            updates.original_price,
            updates.stock_quantity,
            updates.brand,
            updates.size,
            updates.product_condition,
            updates.color,
            updates.material,
            updates.season,
            updates.length,
            updates.width,
            updates.fit,
            updates.updated_at,
            productId
        ]);

        if (hasDiscount) {
            const existingDiscount = await query(
                "SELECT discount_id FROM discounts WHERE product_id = ? ORDER BY discount_id DESC LIMIT 1",
                [productId]
            );
            const requestedEndDate = toDateKey(end_date);
            const isExpired = requestedEndDate <= toDateKey(new Date());
            const discountValues = [Number(discount_percentage), start_date, end_date, is_active && !isExpired ? 1 : 0];

            if (existingDiscount.length) {
                await query(
                    "UPDATE discounts SET discount_percentage = ?, start_date = ?, end_date = ?, is_active = ? WHERE discount_id = ?",
                    [...discountValues, existingDiscount[0].discount_id]
                );
            } else {
                await query(
                    "INSERT INTO discounts (product_id, discount_percentage, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)",
                    [productId, ...discountValues]
                );
            }
        }

        await commit();

        const updatedProduct = await query(
            `SELECT p.*, c.category_name, pi.image_path,
                    (SELECT d.discount_percentage FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS discount_percentage,
                    (SELECT d.start_date FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS start_date,
                    (SELECT d.end_date FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS end_date,
                    (SELECT d.is_active FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS is_active
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.display_order = 1
             WHERE p.product_id = ?
             LIMIT 1`,
            [productId]
        );

        res.json({
            success: true,
            message: "Product updated successfully",
            product: sanitizeDiscount(updatedProduct[0])
        });
    } catch (error) {
        try {
            await rollback();
        } catch (rollbackError) {
            console.error("Rollback error in updateProduct:", rollbackError);
        }
        console.error("Error in updateProduct:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.getProduct = async (req, res) => {
    try {
        await deactivateExpiredDiscounts();

        const sql = 'SELECT p.product_id, p.seller_id,p.category_id,c.category_name,p.product_name,p.description,p.price,p.original_price,p.stock_quantity,p.brand,p.size,p.product_condition,p.color,p.material,p.season,p.length,p.width,p.fit,pi.image_id,pi.image_path,pi.display_order,s.seller_id, s.store_name, s.store_logo,p.created_at,p.updated_at,(SELECT d.discount_percentage FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS discount_percentage,(SELECT d.start_date FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS start_date,(SELECT d.end_date FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS end_date,(SELECT d.is_active FROM discounts d WHERE d.product_id = p.product_id ORDER BY d.discount_id DESC LIMIT 1) AS is_active FROM products AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN product_images AS pi ON p.product_id = pi.product_id AND pi.display_order = 1 LEFT JOIN seller_profiles AS s ON p.seller_id = s.seller_id ORDER BY p.product_id';
        const result = await query(sql);

        res.status(200).json({
            success: true,
            products: result.map(sanitizeDiscount)
        });
    } catch (error) {
        console.error("Error in getProduct:", error);
        res.status(500).json({
            message: "Database Error",
            error: error.message
        });
    }
};
