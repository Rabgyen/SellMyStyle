const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken")

const router = express.Router();

const {
    signUpUser,
    loginUser,
    getUserProfile,
    getUserById,
    updateUserProfile,
    uploadProfilePicture,
} = require("../controllers/userController");

const upload = require("../middleware/upload");

router.post("/signup", signUpUser);
router.post("/login", userController.loginUser);
router.get("/profile",verifyToken, getUserProfile);
router.get("/profile/:id", getUserById);
router.put("/profile/:id", updateUserProfile);

// Profile picture upload — expects multipart/form-data with field name "profilePicture"
router.post("/profile/:id/avatar", upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;