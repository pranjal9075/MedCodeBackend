const Inquiry = require("../models/inquiryModel");


// CREATE
exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, inquiry, message } = req.body;

    if (!name || !phone || !inquiry || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    await Inquiry.createInquiry(req.body);

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// GET ALL
exports.getAllInquiries = async (req, res) => {
  try {
    const data = await Inquiry.getAllInquiries();
    res.json(data);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// DELETE
exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.deleteInquiry(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// UPDATE
exports.updateInquiry = async (req, res) => {
  try {

    const { name, phone, inquiryType, message } = req.body;

    if (!name || !phone || !inquiryType || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
