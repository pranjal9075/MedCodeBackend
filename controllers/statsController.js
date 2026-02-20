const db = require("../config/db");

exports.getTrendData = async (req, res) => {
  try {

    const [registrations] = await db.promise().query(`
      SELECT 
        MONTH(created_at) as monthNumber,
        MONTHNAME(created_at) as name,
        COUNT(*) as registrations
      FROM users
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `);

    const [inquiries] = await db.promise().query(`
      SELECT 
        MONTH(created_at) as monthNumber,
        MONTHNAME(created_at) as name,
        COUNT(*) as inquiries
      FROM inquiries
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `);

    const trendData = registrations.map(reg => {
      const inquiryMatch = inquiries.find(inq => inq.monthNumber === reg.monthNumber);

      return {
        name: reg.name.substring(0,3),
        registrations: reg.registrations,
        inquiries: inquiryMatch ? inquiryMatch.inquiries : 0
      };
    });

    res.json({
      success: true,
      data: trendData
    });

  } catch (error) {
    console.log("Trend Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
