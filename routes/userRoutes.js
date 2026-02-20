const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUser,
  deleteUser,
  getCounts,
  getTrendData,
  changePassword
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET
router.get("/users", getAllUsers);
router.get("/stats/trend", getTrendData);

// ✅ DASHBOARD COUNT
router.get("/stats/count", getCounts);

// ✅ UPDATE
router.put("/users/:id", updateUser);


// ✅ DELETE
router.delete("/users/:id", deleteUser);

// 🔐 CHANGE PASSWORD
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
