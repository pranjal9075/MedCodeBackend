const db = require("../config/db");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const os = require("os");

const desktopDir = path.join(os.homedir(), "Desktop", "MedcodeUploads");

/*
==============================
GET ADMIN
==============================
*/

exports.getAdminProfile = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM admin_profile LIMIT 1");

    res.json({
      success: true,
      data: rows[0],
    });

  } catch {
    res.status(500).json({ success: false });
  }
};

/*
==============================
UPDATE ADMIN
==============================
*/

exports.updateAdminProfile = async (req, res) => {
  const id = req.params.id;
  let { name, email, phone, password } = req.body;

  try {
    const [old] = await db.query(
      "SELECT avatar FROM admin_profile WHERE id=?",
      [id]
    );

    let avatar = old[0]?.avatar;

    if (req.file) {

      if (avatar && avatar.includes("/avatars/")) {
        const oldFile = avatar.split("/avatars/")[1];
        const oldPath = path.join(desktopDir, oldFile);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      avatar = `${req.protocol}://${req.get("host")}/avatars/${req.file.filename}`;
    }

    let query = `
      UPDATE admin_profile
      SET name=?, email=?, phone=?, avatar=?
    `;

    let values = [name, email, phone, avatar];

    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      query += ", password=?";
      values.push(hashed);
    }

    query += " WHERE id=?";
    values.push(id);

    await db.query(query, values);

    res.json({
      success: true,
      avatar,
      message: "Profile updated successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

/*
==============================
ADMIN LOGIN
==============================
*/

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_profile WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const admin = rows[0];

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      message: "Login success",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        avatar: admin.avatar
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
