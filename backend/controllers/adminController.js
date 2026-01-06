const sql = require("mssql");

/* 1️⃣ Admin – View all orders */
const getAllOrders = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT
        o.order_id,
        o.order_status,
        o.payment_status,
        o.created_at,
        c.price,
        b.breed_name,
        bu.name AS buyer_name,
        su.name AS seller_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Buyers byr ON o.buyer_id = byr.buyer_id
      JOIN Users bu ON byr.user_id = bu.user_id
      JOIN Sellers s ON c.seller_id = s.seller_id
      JOIN Users su ON s.user_id = su.user_id
      ORDER BY o.created_at DESC
    `;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 2️⃣ Admin – Update order status */
const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { order_status } = req.body;

  try {
    await sql.query`
      UPDATE Orders
      SET order_status = ${order_status}
      WHERE order_id = ${order_id}
    `;

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const updateUserStatus = async (req, res) => {
//   const { user_id } = req.params;
//   const { status } = req.body; // active | blocked

//   if (!["active", "blocked"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   try {
//     await sql.query`
//       UPDATE Users
//       SET status = ${status}
//       WHERE user_id = ${user_id}
//     `;

//     res.json({ message: `User ${status} successfully` });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const updateUserStatus = async (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  try {
    await sql.query`
      UPDATE Users
      SET status = ${status}
      WHERE user_id = ${user_id}
    `;

    res.json({
      message: "User status updated successfully",
      user_id,
      status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 3️⃣ Admin – Update payment status */
const updatePaymentStatus = async (req, res) => {
  const { order_id } = req.params;
  const { payment_status } = req.body;

  try {
    await sql.query`
      UPDATE Orders
      SET payment_status = ${payment_status}
      WHERE order_id = ${order_id}
    `;

    if (payment_status === "paid") {
      await sql.query`
        UPDATE Orders
        SET order_status = 'completed'
        WHERE order_id = ${order_id}
      `;
    }

    res.json({ message: "Payment status updated successfully 💳" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT
        user_id,
        name,
        email,
        role,
        status,
        created_at
      FROM Users
      ORDER BY created_at DESC
    `;

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/* ================= PLATFORM ANALYTICS ================= */
const getAnalytics = async (req, res) => {
  try {
    const users = await sql.query`
      SELECT
        COUNT(*) AS total_users,
        SUM(CASE WHEN role = 'buyer' THEN 1 ELSE 0 END) AS buyers,
        SUM(CASE WHEN role = 'seller' THEN 1 ELSE 0 END) AS sellers,
        SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) AS blocked_users
      FROM Users
    `;

    const cattle = await sql.query`
      SELECT
        COUNT(*) AS total_cattle,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) AS sold_cattle,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_cattle
      FROM Cattle
    `;

    const orders = await sql.query`
      SELECT
        COUNT(*) AS total_orders,
        SUM(CASE WHEN order_status = 'approved' THEN 1 ELSE 0 END) AS approved_orders,
        SUM(CASE WHEN order_status = 'rejected' THEN 1 ELSE 0 END) AS rejected_orders
      FROM Orders
    `;

    const revenue = await sql.query`
      SELECT
        ISNULL(SUM(c.price), 0) AS total_revenue
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      WHERE o.payment_status = 'paid'
    `;

    res.json({
      users: users.recordset[0],
      cattle: cattle.recordset[0],
      orders: orders.recordset[0],
      revenue: revenue.recordset[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 🔥 THIS EXPORT IS CRITICAL */
module.exports = {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getAllUsers,
  updateUserStatus,
  getAnalytics
};
