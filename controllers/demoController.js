const db = require("../config/db");

// ✅ BOOK DEMO
exports.bookDemo = async (req, res) => {
  const { email, country_code, phone } = req.body;

  try {
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    await db.query(
      "INSERT INTO demo_requests (email, country_code, phone) VALUES (?, ?, ?)",
      [email, country_code, phone]
    );

    res.json({
      success: true,
      message: "Demo booked successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

// ✅ GET ALL DEMOS
exports.getAllDemos = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM demo_requests ORDER BY id DESC"
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

// ✅ DELETE DEMO
exports.deleteDemo = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM demo_requests WHERE id = ?",
      [req.params.id]
    );

    res.json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

// ✅ UPDATE DEMO
exports.updateDemo = async (req, res) => {
  const { email, country_code, phone } = req.body;

  try {
    await db.query(
      "UPDATE demo_requests SET email=?, country_code=?, phone=? WHERE id=?",
      [email, country_code, phone, req.params.id]
    );

    res.json({ success: true, message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
// ✅ VERIFY USER (LOGIN CHECK)
exports.verifyUser = async (req, res) => {
  const { email, country_code, phone } = req.body;

  try {
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone required"
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM demo_requests WHERE email = ? AND country_code = ? AND phone = ?",
      [email, country_code, phone]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        message: "You can watch the demo now"
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Phone"
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
