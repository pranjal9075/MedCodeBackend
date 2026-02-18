const db = require("../config/db");

// Create new user
const createUser = async (user) => {
  const { fullName, email, countryCode, mobile, password } = user;
  const sql = `
    INSERT INTO users (fullName, email, countryCode, mobile, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [fullName, email, countryCode, mobile, password]);
};

// Find user by email
const findUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await db.execute(sql, [email]);
  return rows[0];
};

module.exports = { createUser, findUserByEmail };
