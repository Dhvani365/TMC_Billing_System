import express from "express";
import dotenv from "dotenv";
import con from "./utils/connectDB.js";
import cors from 'cors';

dotenv.config({ path: "../.env" });
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,
}));
app.use(express.json());

// getClients
app.post("/api/getClients", (req, res) => {
  // Query to fetch clients
  const sql = "SELECT * FROM clients";

  // Use the pool to execute the query
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching clients: ", err);
      return res.status(500).send("An error occurred while fetching clients.");
    }
    res.json(results); // Send the results as a JSON response
  });
});

app.post("/api/getCatalog", (req, res) => {

  const sql = "SELECT * FROM catalogs";

  // Use the pool to execute the query with the dynamic parameter
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching catalogs: ", err);
      return res.status(500).send("An error occurred while fetching catalogs.");
    }
    res.json(results); // Send the results as a JSON response
  });
});

app.post("/api/getProduct", (req, res) => {
  // Query to get all products with their catalog IDs
  const optimizedQuery = `
    SELECT p.*, cp.catalog_id
    FROM products p
    LEFT JOIN catalog_products cp ON p.product_id = cp.product_id
  `;

  con.query(optimizedQuery, (err, products) => {
    if (err) {
      console.error("Error fetching products: ", err);
      return res.status(500).json({ error: "An error occurred while fetching products." });
    }

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found." });
    }

    // Group products by catalog_id
    const groupedProducts = products.reduce((acc, product) => {
      const { catalog_id } = product;
      if (!catalog_id) {
        return acc; // Skip products without a catalog_id
      }

      // Initialize array for the catalog_id if it doesn't exist
      if (!acc[catalog_id]) {
        acc[catalog_id] = [];
      }

      // Push the product to the corresponding catalog_id
      acc[catalog_id].push(product);
      return acc;
    }, {});

    res.json(groupedProducts); // Send the grouped products as response
  });
});

app.post("/api/getClient", (req, res) => {
  // Query to get all products with their catalog IDs
  const optimizedQuery = `
    SELECT * FROM CLIENTS
  `;

  con.query(optimizedQuery, (err, clients) => {
    if (err) {
      console.error("Error fetching products: ", err);
      return res.status(500).json({ error: "An error occurred while fetching products." });
    }

    if (clients.length === 0) {
      return res.status(404).json({ error: "No clients found." });
    }

    res.json(clients); // Send the grouped products as response
  });
});

app.post("/api/getDiscountStructure", (req, res) => {
  // Query to get all products with their catalog IDs
  const optimizedQuery = `
    SELECT * FROM client_discount_structure
  `;

  con.query(optimizedQuery, (err, DiscountStructure) => {
    if (err) {
      console.error("Error fetching DiscountStructure: ", err);
      return res.status(500).json({ error: "An error occurred while fetching DiscountStructure." });
    }

    if (DiscountStructure.length === 0) {
      return res.status(404).json({ error: "No DiscountStructure found." });
    }

    res.json(DiscountStructure); // Send the grouped products as response
  });
});

app.post("/api/addBill", (req, res) => {
  // Extract the request body
  const { client_id, bill_date, total_amount, discount_type, discount_percentage } = req.body;

  const optimizedQuery = `
    INSERT INTO bills (client_id, bill_date, total_amount, discount_type, discount_percentage) 
    VALUES (?, ?, ?, ?, ?);
  `;

  // Execute the query with parameterized values
  con.query(optimizedQuery, [client_id, bill_date, total_amount, discount_type, discount_percentage], (err, result) => {
    if (err) {
      console.error("Error inserting bill: ", err);
      return res.status(500).json({ error: "An error occurred while adding the bill." });
    }

    res.status(201).json({
      message: "Bill added successfully!",
      bill_id: result.insertId
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
