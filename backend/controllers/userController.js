const sql = require("mssql");
const bcrypt = require("bcryptjs");

/* =====================================================
   GET USERS
===================================================== */
const getUsers = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) {
    console.error("GetUsers Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE PROFILE NAME
===================================================== */
const updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { name } = req.body;

  try {
    await sql.query`
      UPDATE Users SET name = ${name} WHERE user_id = ${userId}
    `;
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("UpdateProfile Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   CHANGE PASSWORD
===================================================== */
const changePassword = async (req, res) => {
  const userId = req.user.user_id;
  const { oldPassword, newPassword } = req.body;

  try {
    const result = await sql.query`
      SELECT password FROM Users WHERE user_id = ${userId}
    `;

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(oldPassword, result.recordset[0].password);
    if (!valid) return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await sql.query`
      UPDATE Users SET password = ${hashed} WHERE user_id = ${userId}
    `;

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("ChangePassword Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE EMAIL
===================================================== */
const updateEmail = async (req, res) => {
  const userId = req.user.user_id;
  const { email } = req.body;

  try {
    const check = await sql.query`
      SELECT email FROM Users WHERE email = ${email}
    `;

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    await sql.query`
      UPDATE Users SET email = ${email} WHERE user_id = ${userId}
    `;

    res.json({ message: "Email updated successfully" });
  } catch (err) {
    console.error("UpdateEmail Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPLOAD PROFILE PICTURE
===================================================== */
const uploadProfilePicture = async (req, res) => {
  const userId = req.user.user_id;

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const filename = req.file.filename;

  try {
    await sql.query`
      UPDATE Users SET profile_image = ${filename} WHERE user_id = ${userId}
    `;

    res.json({ message: "Profile image updated", file: filename });
  } catch (err) {
    console.error("UploadProfilePicture Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE CONTACT INFO
===================================================== */
const updateContactInfo = async (req, res) => {
  const userId = req.user.user_id;
  const { phone, address } = req.body;

  try {
    await sql.query`
      UPDATE Users 
      SET phone = ${phone}, address = ${address}
      WHERE user_id = ${userId}
    `;

    res.json({ message: "Contact info updated" });
  } catch (err) {
    console.error("UpdateContactInfo Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   ADMIN EDIT USER
===================================================== */
const adminEditUser = async (req, res) => {
  const { user_id, name, email, role, status } = req.body;

  try {
    await sql.query`
      UPDATE Users
      SET name = ${name}, email = ${email}, role = ${role}, status = ${status}
      WHERE user_id = ${user_id}
    `;

    res.json({ message: "User updated by admin" });
  } catch (err) {
    console.error("AdminEditUser Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  updateProfile,
  changePassword,
  updateEmail,
  uploadProfilePicture,
  updateContactInfo,
  adminEditUser
};
