const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUser,
  deleteUser,
  getCounts
} = require("../controllers/userController");


// ✅ GET
router.get("/users", getAllUsers);

// ✅ DASHBOARD COUNT
router.get("/stats/count", getCounts);


// ✅ UPDATE
router.put("/users/:id", updateUser);

// ✅ DELETE
router.delete("/users/:id", deleteUser);

module.exports = router;
