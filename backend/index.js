require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = 5000;

/* CORS */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Connect DB
connectDB();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);       // ✔ ONLY THIS FOR USER ROUTES
app.use("/api/buyer", buyerRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
