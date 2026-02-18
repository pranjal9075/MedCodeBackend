const db = require("../config/db");

// =============================
// 1️⃣ Request Brochure (CHECK USER EXISTS)
// =============================
const requestBrochure = async (req, res) => {
  try {
    const { email, countryCode, mobile } = req.body;

    if (!email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // 🔍 Check if user exists in users table
    const [rows] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? AND mobile = ? AND countryCode = ?`,
      [email, mobile, countryCode || "+91"]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or mobile number",
      });
    }

    // ✅ If found → allow brochure
    res.json({
      success: true,
      pdfUrl: "/brochure.pdf",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// 2️⃣ Get All Brochure Requests
// =============================
const getBrochureRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM brochure_requests ORDER BY id DESC"
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// 3️⃣ Delete Brochure Request
// =============================
const deleteBrochureRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM brochure_requests WHERE id = ?", [id]);
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// 4️⃣ Update Brochure Request
// =============================
const updateBrochureRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, mobile } = req.body;

    await db.query(
      `UPDATE brochure_requests
       SET email = ?, mobile = ?
       WHERE id = ?`,
      [email, mobile, id]
    );

    res.json({ success: true, message: "Record updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  requestBrochure,
  getBrochureRequests,
  deleteBrochureRequest,
  updateBrochureRequest,
};
