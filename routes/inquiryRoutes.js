const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getAllInquiries,
  deleteInquiry,
  updateInquiry,
} = require("../controllers/inquiryController");

// CREATE
router.post("/inquiry", createInquiry);

// GET
router.get("/inquiry", getAllInquiries);

// DELETE
router.delete("/inquiry/:id", deleteInquiry);

// ⭐ UPDATE (THIS WAS MISSING)
router.put("/inquiry/:id", updateInquiry);

module.exports = router;
