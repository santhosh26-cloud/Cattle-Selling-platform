
// const sql = require("mssql");

// /* ============================================================
//    ADD CATTLE
// ============================================================ */
// const addCattle = async (req, res) => {
//   try {
//     const { breed_id, age, price, status, description } = req.body;

//     const seller = await sql.query`
//       SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
//     `;

//     if (!seller.recordset.length) {
//       return res.status(403).json({ message: "Seller profile not found" });
//     }

//     const sellerId = seller.recordset[0].seller_id;
//     const imageUrl = req.file ? `/uploads/cattle/${req.file.filename}` : null;

//     await sql.query`
//       INSERT INTO Cattle (seller_id, breed_id, age, price, status, description, image_url)
//       VALUES (${sellerId}, ${breed_id}, ${age}, ${price}, ${status}, ${description}, ${imageUrl})
//     `;

//     res.json({ message: "Cattle added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ============================================================
//    GET ALL CATTLE FOR SELLER
// ============================================================ */
// const getSellerCattle = async (req, res) => {
//   try {
//     const seller = await sql.query`
//       SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
//     `;

//     const sellerId = seller.recordset[0].seller_id;

//     const result = await sql.query`
//       SELECT cattle_id, breed_id, age, price, status, description, image_url
//       FROM Cattle
//       WHERE seller_id = ${sellerId}
//     `;

//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ============================================================
//    GET SINGLE CATTLE (FOR EDIT)
// ============================================================ */
// const getSingleCattle = async (req, res) => {
//   try {
//     const result = await sql.query`
//       SELECT cattle_id, breed_id, age, price, status, description, image_url
//       FROM Cattle 
//       WHERE cattle_id = ${req.params.id}
//     `;

//     if (!result.recordset.length) {
//       return res.status(404).json({ message: "Cattle not found" });
//     }

//     res.json(result.recordset[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ============================================================
//    UPDATE CATTLE
// ============================================================ */
// const updateCattle = async (req, res) => {
//   try {
//     const { breed_id, age, price, status, description } = req.body;
//     const imageUrl = req.file ? `/uploads/cattle/${req.file.filename}` : null;

//     if (imageUrl) {
//       await sql.query`
//         UPDATE Cattle
//         SET breed_id = ${breed_id}, 
//             age = ${age}, 
//             price = ${price}, 
//             status = ${status},
//             description = ${description},
//             image_url = ${imageUrl}
//         WHERE cattle_id = ${req.params.id}
//       `;
//     } else {
//       await sql.query`
//         UPDATE Cattle
//         SET breed_id = ${breed_id}, 
//             age = ${age}, 
//             price = ${price},
//             status = ${status},
//             description = ${description}
//         WHERE cattle_id = ${req.params.id}
//       `;
//     }

//     res.json({ message: "Cattle updated successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ============================================================
//    DELETE CATTLE
// ============================================================ */
// const deleteCattle = async (req, res) => {
//   try {
//     await sql.query`
//       DELETE FROM Cattle WHERE cattle_id = ${req.params.id}
//     `;

//     res.json({ message: "Cattle deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ============================================================
//    GET SELLER ORDERS
// ============================================================ */
// const getSellerOrders = async (req, res) => {
//   try {
//     const seller = await sql.query`
//       SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
//     `;

//     const sellerId = seller.recordset[0].seller_id;

//     const result = await sql.query`
//       SELECT
//         o.order_id,
//         o.order_status,
//         o.payment_status,
//         c.cattle_id,
//         c.price,
//         c.description,
//         b.breed_name,
//         u.name AS buyer_name
//       FROM Orders o
//       JOIN Cattle c ON o.cattle_id = c.cattle_id
//       JOIN Breeds b ON c.breed_id = b.breed_id
//       JOIN Buyers bu ON o.buyer_id = bu.buyer_id
//       JOIN Users u ON bu.user_id = u.user_id
//       WHERE c.seller_id = ${sellerId}
//     `;

//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ============================================================
//    UPDATE ORDER STATUS
// ============================================================ */
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     await sql.query`
//       UPDATE Orders SET order_status = ${status} 
//       WHERE order_id = ${req.params.order_id}
//     `;

//     res.json({ message: "Order status updated" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   addCattle,
//   getSellerCattle,
//   getSingleCattle,
//   updateCattle,
//   deleteCattle,
//   getSellerOrders,
//   updateOrderStatus,
// };
const sql = require("mssql");

/* ============================================================
   ADD CATTLE
============================================================ */
const addCattle = async (req, res) => {
  try {
    const { breed_id, age, price, status, description, tags } = req.body;

    const seller = await sql.query`
      SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
    `;

    if (!seller.recordset.length) {
      return res.status(403).json({ message: "Seller profile not found" });
    }

    const sellerId = seller.recordset[0].seller_id;
    const imageUrl = req.file ? `/uploads/cattle/${req.file.filename}` : null;

    await sql.query`
      INSERT INTO Cattle (seller_id, breed_id, age, price, status, description, tags, image_url)
      VALUES (${sellerId}, ${breed_id}, ${age}, ${price}, ${status}, ${description}, ${tags}, ${imageUrl})
    `;

    res.json({ message: "Cattle added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   GET ALL CATTLE FOR SELLER
============================================================ */
const getSellerCattle = async (req, res) => {
  try {
    const seller = await sql.query`
      SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
    `;

    const sellerId = seller.recordset[0].seller_id;

    const result = await sql.query`
      SELECT cattle_id, breed_id, age, price, status, description, tags, image_url
      FROM Cattle
      WHERE seller_id = ${sellerId}
    `;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   GET SINGLE CATTLE (FOR EDIT)
============================================================ */
const getSingleCattle = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT cattle_id, breed_id, age, price, status, description, tags, image_url
      FROM Cattle 
      WHERE cattle_id = ${req.params.id}
    `;

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Cattle not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   UPDATE CATTLE
============================================================ */
const updateCattle = async (req, res) => {
  try {
    const { breed_id, age, price, status, description, tags } = req.body;
    const imageUrl = req.file ? `/uploads/cattle/${req.file.filename}` : null;

    if (imageUrl) {
      await sql.query`
        UPDATE Cattle
        SET breed_id = ${breed_id},
            age = ${age},
            price = ${price},
            status = ${status},
            description = ${description},
            tags = ${tags},
            image_url = ${imageUrl}
        WHERE cattle_id = ${req.params.id}
      `;
    } else {
      await sql.query`
        UPDATE Cattle
        SET breed_id = ${breed_id},
            age = ${age},
            price = ${price},
            status = ${status},
            description = ${description},
            tags = ${tags}
        WHERE cattle_id = ${req.params.id}
      `;
    }

    res.json({ message: "Cattle updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   DELETE CATTLE
============================================================ */
const deleteCattle = async (req, res) => {
  try {
    await sql.query`
      DELETE FROM Cattle WHERE cattle_id = ${req.params.id}
    `;

    res.json({ message: "Cattle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   GET SELLER ORDERS
============================================================ */
const getSellerOrders = async (req, res) => {
  try {
    const seller = await sql.query`
      SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
    `;

    const sellerId = seller.recordset[0].seller_id;

    const result = await sql.query`
      SELECT
        o.order_id,
        o.order_status,
        o.payment_status,
        c.cattle_id,
        c.price,
        c.description,
        c.tags,
        b.breed_name,
        u.name AS buyer_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Buyers bu ON o.buyer_id = bu.buyer_id
      JOIN Users u ON bu.user_id = u.user_id
      WHERE c.seller_id = ${sellerId}
    `;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   UPDATE ORDER STATUS
============================================================ */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await sql.query`
      UPDATE Orders SET order_status = ${status} 
      WHERE order_id = ${req.params.order_id}
    `;

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCattle,
  getSellerCattle,
  getSingleCattle,
  updateCattle,
  deleteCattle,
  getSellerOrders,
  updateOrderStatus,
};
