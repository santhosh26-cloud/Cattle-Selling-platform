
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Insert user and get user_id
const result = await sql.query`
  INSERT INTO Users (name, email, password, role)
  OUTPUT INSERTED.user_id
  VALUES (${name}, ${email}, ${hashedPassword}, ${role})
`;

const userId = result.recordset[0].user_id;

// 2️⃣ Auto create role profile
if (role === "buyer") {
  await sql.query`
    INSERT INTO Buyers (user_id)
    VALUES (${userId})
  `;
}

if (role === "seller") {
  await sql.query`
    INSERT INTO Sellers (user_id)
    VALUES (${userId})
  `;
}


    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  console.log("LOGIN HIT", req.body);
  
  const { email, password } = req.body;

  try {
    const result = await sql.query`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.recordset[0];

    // 🔴 BLOCKED USER CHECK
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact admin."
      });
    }
    console.log("EMAIL FROM UI:", email);
    console.log("PASSWORD FROM UI:", password);
    console.log("HASH FROM DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= EXPORT ================= */
module.exports = {
  registerUser,
  login
};
