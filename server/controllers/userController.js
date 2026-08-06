const db = require("../config/db");
const jwt = require('jsonwebtoken');

exports.signUpUser = (req, res) => {

    const { fullName, email, password } = req.body;

    db.query(
        "INSERT INTO users (username,email,password) VALUES (?,?,?)",
        [fullName, email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            const userId = result.insertId;

            // Fetch the newly created user
            db.query(
                "SELECT user_id, username, email, phone, country, city, bio, profile_picture, created_at FROM users WHERE user_id = ?",
                [userId],
                (err, userResult) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    const user = userResult[0];
                    res.json({
                        success: true,
                        message: "User Registered Successfully",
                        user: {
                            user_id: user.user_id,
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            country: user.country,
                            city: user.city,
                            bio: user.bio,
                            profile_picture: user.profile_picture,
                            memberSince: user.created_at ? new Date(user.created_at).getFullYear().toString() : "2024"
                        }
                    });
                }
            );

        }
    );

};

exports.loginUser = (req, res) => {

    console.log("Login route hit");
    console.log(req.body);

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    field: "email",
                    message: "User not found"
                });
            }

            const user = result[0];

            if (user.password !== password) {
                return res.json({
                    success: false,
                    field: "password",
                    message: "Incorrect Password"
                });
            }

            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }

            )
            console.log(token)
            res.json({
                success: true,
                token,
                user
            });

        }
    );

};

exports.getUserProfile = (req, res) => {
    const userId = req.user.user_id;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
    }

    db.query(
        "SELECT user_id, username, email, phone, nationality, country, city, postal_code, street_address, bio, profile_picture, followers_count, following_count, created_at FROM users WHERE user_id = ?",
        [userId],
        (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const user = result[0];

            // Check if user has a verified seller profile
            db.query(
                `SELECT seller_id, store_name, store_description, store_logo, business_type, verification_status, submitted_at
                 FROM seller_profiles WHERE user_id = ? AND verification_status IN ('Verified', 'Approved')`,
                [userId],
                (err2, sellerResults) => {
                    if (err2) {
                        console.error("Error fetching seller profile:", err2);
                        // Return user data even if seller profile fetch fails
                        return res.json({
                            success: true,
                            user: {
                                id: user.user_id,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                nationality: user.nationality,
                                country: user.country,
                                city: user.city,
                                postal_code: user.postal_code,
                                street_address: user.street_address,
                                bio: user.bio,
                                profile_picture: user.profile_picture,
                                followers_count: user.followers_count,
                                following_count: user.following_count,
                                memberSince: user.created_at ? new Date(user.created_at).getFullYear().toString() : "2024",
                                created_at: user.created_at
                            },
                            sellerProfile: null
                        });
                    }

                    const sellerProfile = sellerResults.length > 0 ? sellerResults[0] : null;

                    const sendResponse = (profileWithLinks = null) => {
                        res.json({
                            success: true,
                            user: {
                                id: user.user_id,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                nationality: user.nationality,
                                country: user.country,
                                city: user.city,
                                postal_code: user.postal_code,
                                street_address: user.street_address,
                                bio: user.bio,
                                profile_picture: user.profile_picture,
                                followers_count: user.followers_count,
                                following_count: user.following_count,
                                memberSince: user.created_at ? new Date(user.created_at).getFullYear().toString() : "2024",
                                created_at: user.created_at
                            },
                            sellerProfile: profileWithLinks
                        });
                    };

                    if (sellerProfile) {
                        db.query("SELECT platform, url FROM seller_social_links WHERE seller_id = ?", [sellerProfile.seller_id], (err3, socialLinks) => {
                            if (!err3) {
                                sellerProfile.socialLinks = socialLinks;
                            } else {
                                sellerProfile.socialLinks = [];
                            }
                            sendResponse(sellerProfile);
                        });
                    } else {
                        sendResponse(null);
                    }
                }
            );
        }
    );
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
    }

    db.query(
        "SELECT user_id, username, email, phone, nationality, country, city, postal_code, street_address, bio, profile_picture, followers_count, following_count, created_at FROM users WHERE user_id = ?",
        [userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const user = result[0];
            const userObj = {
                id: user.user_id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                nationality: user.nationality,
                country: user.country,
                city: user.city,
                postal_code: user.postal_code,
                street_address: user.street_address,
                bio: user.bio,
                profile_picture: user.profile_picture,
                followers_count: user.followers_count,
                following_count: user.following_count,
                memberSince: user.created_at ? new Date(user.created_at).getFullYear().toString() : "2024",
                created_at: user.created_at
            };

            db.query(
                `SELECT seller_id, store_name, store_description, store_logo, business_type, verification_status, submitted_at
                 FROM seller_profiles WHERE user_id = ?`,
                [userId],
                (err2, sellerResults) => {
                    if (err2) {
                        console.error("Error fetching seller profile:", err2);
                        return res.json({ success: true, user: userObj, sellerProfile: null });
                    }

                    const sellerProfile = sellerResults.length > 0 ? sellerResults[0] : null;

                    if (sellerProfile) {
                        db.query("SELECT platform, url FROM seller_social_links WHERE seller_id = ?", [sellerProfile.seller_id], (err3, socialLinks) => {
                            sellerProfile.socialLinks = !err3 ? socialLinks : [];
                            return res.json({ success: true, user: userObj, sellerProfile });
                        });
                    } else {
                        return res.json({ success: true, user: userObj, sellerProfile: null });
                    }
                }
            );
        }
    );
};

exports.updateUserProfile = (req, res) => {
    const userId = req.params.id;
    const { username, phone, country, city, bio, profile_picture } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
    }

    const updates = [];
    const values = [];

    if (username !== undefined) { updates.push("username = ?"); values.push(username); }
    if (phone !== undefined) { updates.push("phone = ?"); values.push(phone); }
    if (country !== undefined) { updates.push("country = ?"); values.push(country); }
    if (city !== undefined) { updates.push("city = ?"); values.push(city); }
    if (bio !== undefined) { updates.push("bio = ?"); values.push(bio); }
    if (profile_picture !== undefined) { updates.push("profile_picture = ?"); values.push(profile_picture); }

    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: "No fields to update" });
    }

    values.push(userId);

    db.query(
        `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`,
        values,
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            res.json({ success: true, message: "Profile updated successfully" });
        }
    );
};

exports.uploadProfilePicture = (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Build a relative URL path that the frontend can use
    const profilePicturePath = `/uploads/${req.file.filename}`;

    // Fetch the current profile picture so we can delete the old file
    db.query(
        "SELECT profile_picture FROM users WHERE user_id = ?",
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }

            // Delete old file from disk if it exists and is not null
            if (result.length > 0 && result[0].profile_picture) {
                const oldFile = result[0].profile_picture; // e.g. "/uploads/avatar_7_xxx.jpg"
                const oldPath = require("path").join(__dirname, "..", oldFile);
                require("fs").unlink(oldPath, () => { }); // silently ignore if already gone
            }

            // Save new path to DB
            db.query(
                "UPDATE users SET profile_picture = ? WHERE user_id = ?",
                [profilePicturePath, userId],
                (err2) => {
                    if (err2) {
                        return res.status(500).json({ success: false, message: "Failed to save image path" });
                    }
                    res.json({
                        success: true,
                        message: "Profile picture updated successfully",
                        profile_picture: profilePicturePath,
                    });
                }
            );
        }
    );
};
