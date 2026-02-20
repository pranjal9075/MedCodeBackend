const Inquiry = require("../models/inquiryModel");
const db = require("../config/db"); // your MySQL connection

// CREATE INQUIRY
exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, inquiry, message } = req.body;

    // ✅ Validate fields
    if (!name || !phone || !inquiry || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // ✅ Check if user is registered
    const [user] = await db.execute(
      "SELECT id FROM users WHERE fullName = ? AND mobile = ?",
      [name, phone]
    );

    if (!user.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid name or mobile number. You must be registered name or mobile number.",
      });
    }

    // ✅ Create inquiry
    await Inquiry.createInquiry(req.body);

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });

  } catch (error) {
    console.error("Create Inquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET ALL INQUIRIES
exports.getAllInquiries = async (req, res) => {
  try {
    const data = await Inquiry.getAllInquiries();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// DELETE INQUIRY
exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.deleteInquiry(req.params.id);
    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// UPDATE INQUIRY
exports.updateInquiry = async (req, res) => {
  try {
    const { name, phone, inquiryType, message } = req.body;

    if (!name || !phone || !inquiryType || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // ✅ Optional: validate user exists on update too
    const [user] = await db.execute(
      "SELECT id FROM users WHERE fullName = ? AND mobile = ?",
      [name, phone]
    );

    if (!user.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid name or mobile number. You must be registered first.",
      });
    }

    await Inquiry.updateInquiry(
      req.params.id,
      name,
      phone,
      inquiryType,
      message
    );

    res.json({
      success: true,
      message: "Inquiry updated successfully",
    });

  } catch (error) {
    console.error("Update Inquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
