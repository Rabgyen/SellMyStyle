const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);

const registerSeller = async (req, res) => {
    try {
        const {
            seller_id,
            storeName,
            storeDescription,
            businessType,
            paymentMethod,
            bankAccountName,
            bankAccountNumber,
            idType,
            infoAccurate,
            termsAgreed,
            falseInfo,
            authorizeReview,
            // Socials
            socialInstagramEnabled, socialInstagramUrl,
            socialTiktokEnabled, socialTiktokUrl,
            socialFacebookEnabled, socialFacebookUrl,
            socialXEnabled, socialXUrl,
            socialYoutubeEnabled, socialYoutubeUrl
        } = req.body;

        if (!seller_id) {
            return res.status(400).json({ success: false, message: "seller_id is required" });
        }

        // Get file paths
        const files = req.files || {};
        const storeLogoPath = files.storeLogo ? `/uploads/${files.storeLogo[0].filename}` : "";
        const idFrontPath = files.idFront ? `/uploads/${files.idFront[0].filename}` : "";
        const idBackPath = files.idBack ? `/uploads/${files.idBack[0].filename}` : "";

        const now = new Date();

        // Map frontend values to database enum values
        const businessTypeMap = {
            'individual': 'Individual Seller',
            'company': 'Registered Company',
            'brand': 'Small Business'
        };
        const paymentMethodMap = {
            'bank_transfer': 'Bank Transfer',
            'visa_card': 'Bank Transfer', // Map visa card to bank transfer
            'paypal': 'PayPal',
            'other': 'Bank Transfer'
        };
        const identityTypeMap = {
            'citizen_card': 'Citizenship',
            'passport': 'Passport',
            'driving_license': 'Driving License',
            'national_id': 'National ID'
        };
        const platformMap = {
            'Instagram': 'Instagram',
            'Tiktok': 'TikTok',
            'Facebook': 'Facebook',
            'X': 'X',
            'Youtube': 'YouTube'
        };

        const dbBusinessType = businessTypeMap[businessType] || 'Individual Seller';
        const dbPaymentMethod = paymentMethodMap[paymentMethod] || 'Bank Transfer';
        const dbIdentityType = identityTypeMap[idType] || 'Citizenship';

        // 1. Insert into seller_profiles
        const profilesResult = await query(
            `INSERT INTO seller_profiles
             (user_id, store_name, store_description, store_logo, business_type, verification_status, submitted_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [seller_id, storeName, storeDescription, storeLogoPath, dbBusinessType, "Pending", now]
        );

        const sellerProfileId = profilesResult.insertId;

        // 2. Insert into seller_payment_details
        let accNum = bankAccountNumber;
        let paypalEmail = null;
        if (paymentMethod === "paypal") {
            paypalEmail = bankAccountNumber; // Storing in paypal_email field if it's paypal
            accNum = null;
        }

        await query(
            `INSERT INTO seller_payment_details
             (seller_id, payment_method, account_holder_name, account_number, paypal_email)
             VALUES (?, ?, ?, ?, ?)`,
            [sellerProfileId, dbPaymentMethod, bankAccountName, accNum, paypalEmail]
        );

        // 3. Insert into seller_identity_verification
        await query(
            `INSERT INTO seller_identity_verification
             (seller_id, identity_type, identity_front_image, identity_back_image)
             VALUES (?, ?, ?, ?)`,
            [sellerProfileId, dbIdentityType, idFrontPath, idBackPath]
        );

        // 4. Insert into seller_agreements
        await query(
            `INSERT INTO seller_agreements
             (seller_id, information_accuracy_confirmed, terms_condition_accepted, false_information_acknowledged, verification_review_authorized, accepted_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                sellerProfileId,
                infoAccurate === "true" || infoAccurate === true ? 1 : 0,
                termsAgreed === "true" || termsAgreed === true ? 1 : 0,
                falseInfo === "true" || falseInfo === true ? 1 : 0,
                authorizeReview === "true" || authorizeReview === true ? 1 : 0,
                now
            ]
        );

        // 5. Insert into seller_social_links
        const socialPlatforms = [
            { name: "Instagram", enabled: socialInstagramEnabled, url: socialInstagramUrl },
            { name: "Tiktok", enabled: socialTiktokEnabled, url: socialTiktokUrl },
            { name: "Facebook", enabled: socialFacebookEnabled, url: socialFacebookUrl },
            { name: "X", enabled: socialXEnabled, url: socialXUrl },
            { name: "Youtube", enabled: socialYoutubeEnabled, url: socialYoutubeUrl }
        ];

        for (const platform of socialPlatforms) {
            if (platform.enabled === "true" || platform.enabled === true) {
                if (platform.url) {
                    const dbPlatform = platformMap[platform.name] || platform.name;
                    await query(
                        `INSERT INTO seller_social_links (seller_id, platform, url) VALUES (?, ?, ?)`,
                        [sellerProfileId, dbPlatform, platform.url]
                    );
                }
            }
        }

        res.status(201).json({ success: true, message: "Seller application submitted successfully" });
    } catch (error) {
        console.error("Error in registerSeller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const products = await query(`
            SELECT p.*, c.category_name as category,
                   (SELECT image_path FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.seller_id = ?
            ORDER BY p.created_at DESC
        `, [sellerId]);

        res.json({ success: true, products });
    } catch (error) {
        console.error("Error in getSellerProducts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const getSellerCollections = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Get products grouped by category as collections
        const collections = await query(`
            SELECT c.category_id, c.category_name as name, COUNT(p.product_id) as item_count,
                   (SELECT image_path FROM product_images pi
                    JOIN products p2 ON pi.product_id = p2.product_id
                    WHERE p2.category_id = c.category_id AND p2.seller_id = ?
                    ORDER BY pi.display_order LIMIT 1) as cover_image
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.category_id AND p.seller_id = ?
            WHERE c.category_id IN (SELECT DISTINCT category_id FROM products WHERE seller_id = ?)
            GROUP BY c.category_id, c.category_name
            ORDER BY item_count DESC
        `, [sellerId, sellerId, sellerId]);

        res.json({ success: true, collections });
    } catch (error) {
        console.error("Error in getSellerCollections:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const getSellerProfile = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Get seller profile with user info
        const profile = await query(`
            SELECT sp.*, u.username, u.email, u.profile_picture
            FROM seller_profiles sp
            JOIN users u ON sp.user_id = u.user_id
            WHERE sp.seller_id = ?
        `, [sellerId]);

        if (profile.length === 0) {
            return res.status(404).json({ success: false, message: "Seller profile not found" });
        }

        res.json({ success: true, profile: profile[0] });
    } catch (error) {
        console.error("Error in getSellerProfile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    registerSeller,
    getSellerProducts,
    getSellerCollections,
    getSellerProfile
};
