const db = require("../config/db");
const bcrypt = require("bcryptjs");

//---------------------------------------------------
// ✅ GET ALL USERS
//---------------------------------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, fullName AS name, email, mobile, created_at FROM users ORDER BY created_at DESC"
    );

    const formattedUsers = rows.map(user => {
      const joinedDays = Math.floor(
        (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
      );

      return {
        ...user,
        joined:
          joinedDays === 0
            ? "Today"
            : joinedDays === 1
            ? "1 day ago"
            : `${joinedDays} days ago`,
      };
    });

    res.status(200).json(formattedUsers);

  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};




//---------------------------------------------------
// ✅ UPDATE USER (PUT)
//---------------------------------------------------
exports.updateUser = async (req, res) => {
  try {

    const { id } = req.params;
    const { fullName, email, countryCode, mobile, password } = req.body;

    let query;
    let values;

    //---------------------------------------------------
    // hash password ONLY if provided
    //---------------------------------------------------
    if (password) {

      const hashedPassword = await bcrypt.hash(password, 10);

      query = `
        UPDATE users
        SET fullName=?, email=?, countryCode=?, mobile=?, password=?
        WHERE id=?
      `;

      values = [fullName, email, countryCode, mobile, hashedPassword, id];

    } else {

      query = `
        UPDATE users
        SET fullName=?, email=?, countryCode=?, mobile=?
        WHERE id=?
      `;

      values = [fullName, email, countryCode, mobile, id];
    }

    await db.execute(query, values);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};



//---------------------------------------------------
// ✅ DELETE USER
//---------------------------------------------------
exports.deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    await db.execute("DELETE FROM users WHERE id=?", [id]);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};



//---------------------------------------------------
// ✅ DASHBOARD COUNTS
//---------------------------------------------------
exports.getCounts = async (req, res) => {
  try {

    const [totalUsers] = await db.execute(
      "SELECT COUNT(*) AS total FROM users"
    );

    const [todayUsers] = await db.execute(
      "SELECT COUNT(*) AS today FROM users WHERE DATE(created_at)=CURDATE()"
    );

     // ✅ TOTAL INQUIRIES ⭐⭐⭐
    const [inquiries] = await db.query(
      "SELECT COUNT(*) AS totalInquiries FROM inquiries"
    );

    res.status(200).json({
      success: true,
      data: {
        totalRegistrations: totalUsers[0].total,
        newToday: todayUsers[0].today,
        totalInquiries: inquiries[0].totalInquiries,
      },
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
    });
  }
};

//---------------------------------------------------
// ✅ REGISTRATIONS & INQUIRIES TREND (Monthly)
//---------------------------------------------------
exports.getTrendData = async (req, res) => {
  try {

    const [registrations] = await db.query(`
  SELECT 
    MONTH(created_at) as monthNumber,
    DATE_FORMAT(MIN(created_at), '%b') as name,
    COUNT(*) as registrations
  FROM users
  GROUP BY MONTH(created_at)
  ORDER BY MONTH(created_at)
`);

const [inquiries] = await db.query(`
  SELECT 
    MONTH(created_at) as monthNumber,
    DATE_FORMAT(MIN(created_at), '%b') as name,
    COUNT(*) as inquiries
  FROM inquiries
  GROUP BY MONTH(created_at)
  ORDER BY MONTH(created_at)
`);


    const trendData = registrations.map(reg => {
      const match = inquiries.find(inq => inq.monthNumber === reg.monthNumber);

      return {
        name: reg.name,
        registrations: reg.registrations,
        inquiries: match ? match.inquiries : 0
      };
    });

    res.json({
      success: true,
      data: trendData
    });

  } catch (error) {
    console.error("Trend Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching trend data"
    });
  }
};

//---------------------------------------------------
// ✅ CHANGE PASSWORD (Logged-in User)
//---------------------------------------------------
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get current user
    const [rows] = await db.execute(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};


