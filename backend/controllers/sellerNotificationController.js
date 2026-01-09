const sql = require("mssql");

// Fetch all seller notifications
const getSellerNotifications = async (req, res) => {
  const sellerId = req.user.seller_id;

  try {
    const result = await sql.query`
      SELECT *
      FROM Notifications
      WHERE seller_id = ${sellerId}
      ORDER BY created_at DESC
    `;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`
      UPDATE Notifications
      SET is_read = 1
      WHERE notification_id = ${id}
    `;

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSellerNotifications,
  markAsRead
};
