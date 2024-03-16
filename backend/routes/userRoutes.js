const express = require("express");
const { registerUser, login, logout, forgotPassword, resetPassword, getUserDetails, UserUpdatePassword, UserUpdateProfile, getAllUsers, getSingleUser, updateRoles, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, UserUpdatePassword);
router.route("/me/update").put(isAuthenticatedUser, UserUpdateProfile);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateRoles)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)


module.exports = router