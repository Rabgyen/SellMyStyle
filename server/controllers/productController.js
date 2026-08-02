const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);
const beginTransaction = util.promisify(db.beginTransaction).bind(db);
const commit = util.promisify(db.commit).bind(db);
const rollback = util.promisify(db.rollback).bind(db);

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

        const sql = `
            SELECT 
                p.*,
                c.category_name,
                pi.image_path
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.display_order = 1
            WHERE p.product_id = ?
        `;

        const result = await query(sql, [productId]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const product = result[0];

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
            fit
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

        const updatedProduct = await query(
            `SELECT p.*, c.category_name, pi.image_path
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
            product: updatedProduct[0]
        });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.getProduct = (req, res) => {
    const sql = 'SELECT p.product_id, p.seller_id,p.category_id,c.category_name,p.product_name,p.description,p.price,p.original_price,p.stock_quantity,p.brand,p.size,p.product_condition,p.color,p.material,p.season,p.length,p.width,p.fit,pi.image_id,pi.image_path,pi.display_order,p.created_at,p.updated_at FROM products AS p LEFT JOIN categories AS c ON p.category_id = c.category_id LEFT JOIN product_images AS pi ON p.product_id = pi.product_id AND pi.display_order = 1 ORDER BY p.product_id';

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database Error",
                error: err
            });
        }

        res.status(200).json({
            success: true,
            products: result
        });
    });


}