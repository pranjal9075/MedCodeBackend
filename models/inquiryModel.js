const db = require("../config/db");


// ✅ CREATE
const createInquiry = async (data) => {
  const { name, phone, inquiry, message } = data;

  const sql = `
    INSERT INTO inquiries 
    (name, phone, inquiry, message) 
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    name,
    phone,
    inquiry,
    message,
  ]);

  return result;
};


// ✅ GET ALL
const getAllInquiries = async () => {
  const [rows] = await db.query(
    "SELECT * FROM inquiries ORDER BY created_at DESC"
  );

  return rows;
};


// ✅ DELETE
const deleteInquiry = async (id) => {
  const [result] = await db.query(
    "DELETE FROM inquiries WHERE id=?",
    [id]
  );

  return result;
};


// ✅ UPDATE  ⭐⭐⭐ VERY IMPORTANT
const updateInquiry = async (id, name, phone, inquiryType, message) => {

  const [result] = await db.query(
    `UPDATE inquiries 
     SET name=?, phone=?, inquiry=?, message=? 
     WHERE id=?`,
    [name, phone, inquiryType, message, id]
  );

  return result;
};



module.exports = {
  createInquiry,
  getAllInquiries,
  deleteInquiry,
  updateInquiry, // ⭐ MUST EXPORT
};
