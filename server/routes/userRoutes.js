const express = require("express");

const router = express.Router();

const {
    signUpUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
} = require("../controllers/userController");

const upload = require("../middleware/upload");

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);

// Profile picture upload — expects multipart/form-data with field name "profilePicture"
router.post("/profile/:id/avatar", upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;