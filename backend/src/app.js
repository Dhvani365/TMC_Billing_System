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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
