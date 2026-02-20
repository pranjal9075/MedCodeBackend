const db = require("../config/db");

// ----------------------------------------
// CREATE USER
// ----------------------------------------
exports.createUser = async (user) => {
  const { fullName, email, countryCode, mobile, password } = user;

  const sql = `
    INSERT INTO users (fullName, email, countryCode, mobile, password)
    VALUES (?, ?, ?, ?, ?)
  `;

  return db.execute(sql, [fullName, email, countryCode, mobile, password]);
};

// ----------------------------------------
// FIND USER BY EMAIL
// ----------------------------------------
exports.findUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await db.execute(sql, [email]);
  return rows[0];
};

// ----------------------------------------
// UPDATE PROFILE BY ID
// ----------------------------------------
exports.updateUserById = async (id, data) => {
  await db.execute(
    `UPDATE users 
     SET fullName = ?, mobile = ?, countryCode = ?, photo = ?
     WHERE id = ?`,
    [data.fullName, data.mobile, data.countryCode, data.photo, id]
  );

  const [rows] = await db.execute(
    "SELECT id, fullName, email, mobile, countryCode, photo FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
};
