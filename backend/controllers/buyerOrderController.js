const sql = require("mssql");
const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");

const placeOrder = async (req, res) => {
  const buyerUserId = req.user.user_id;
  const { cattle_id } = req.body;

  try {
    const buyerResult = await sql.query`
      SELECT buyer_id FROM Buyers WHERE user_id = ${buyerUserId}
    `;

    if (buyerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Buyer profile not found" });
    }

    const buyer_id = buyerResult.recordset[0].buyer_id;

    await sql.query`
      INSERT INTO Orders (buyer_id, cattle_id, order_status, payment_status)
      VALUES (${buyer_id}, ${cattle_id}, 'placed', 'pending')
    `;

    await sql.query`
      UPDATE Cattle
      SET status = 'ordered'
      WHERE cattle_id = ${cattle_id}
    `;

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getBuyerOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const buyerResult = await sql.query`
      SELECT buyer_id FROM Buyers WHERE user_id = ${userId}
    `;

    if (buyerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Buyer profile not found" });
    }

    const buyerId = buyerResult.recordset[0].buyer_id;

    const ordersResult = await sql.query`
      SELECT
        o.order_id,
        o.order_status,
        o.payment_status,
        o.created_at,
        c.price,
        c.image_url,
        b.breed_name,
        su.name AS seller_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Sellers s ON c.seller_id = s.seller_id
      JOIN Users su ON s.user_id = su.user_id
      WHERE o.buyer_id = ${buyerId}
      ORDER BY o.created_at DESC
    `;

    res.json(ordersResult.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order details
    const result = await sql.query`
      SELECT 
        o.order_id, 
        o.created_at,
        o.payment_status,
        c.price, 
        b.breed_name,
        u.name AS buyer_name,
        us.name AS seller_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Buyers bu ON o.buyer_id = bu.buyer_id
      JOIN Users u ON bu.user_id = u.user_id
      JOIN Sellers s ON c.seller_id = s.seller_id
      JOIN Users us ON s.user_id = us.user_id
      WHERE o.order_id = ${orderId}
    `;

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = result.recordset[0];

    // Create PDF file
    const pdfPath = path.join(__dirname, `../invoices/invoice_${orderId}.pdf`);
    const doc = new pdf();

    // Ensure folder exists
    if (!fs.existsSync(path.join(__dirname, "../invoices"))) {
      fs.mkdirSync(path.join(__dirname, "../invoices"));
    }

    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // PDF CONTENT
    doc.fontSize(20).text("Cattle Purchase Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice Number: INV-${orderId}`);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Buyer Name: ${order.buyer_name}`);
    doc.text(`Seller Name: ${order.seller_name}`);
    doc.moveDown();

    doc.text(`Cattle Breed: ${order.breed_name}`);
    doc.text(`Price: ₹${order.price}`);
    doc.text(`Payment Status: ${order.payment_status}`);
    doc.moveDown();

    doc.text("Thank you for your purchase!", { align: "center" });

    doc.end();

    writeStream.on("finish", () => {
      res.download(pdfPath, `invoice_${orderId}.pdf`);
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  placeOrder,
  getBuyerOrders,
  downloadInvoice
};
