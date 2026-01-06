const sql = require("mssql");

const config = {
  user: "sa",
  password: "san@2004", // <-- the password you just set
  server: "localhost",
  database: "CattleSellingDB",
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: false,
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("✅ SQL Server Connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};

module.exports = connectDB;
