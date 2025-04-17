import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import brandRoutes from "./routes/brand.route.js";
import catalogRoutes from "./routes/catalog.route.js";
import discountRoutes from "./routes/discount.route.js";
import partyRoutes from "./routes/party.route.js";
import partyBrandRoutes from "./routes/partyBrand.route.js";
import pricingRoutes from "./routes/pricing.route.js";
import skuRoutes from "./routes/sku.route.js";
import specialDiscountRoutes from "./routes/specialdiscount.route.js";
import cookieParser from 'cookie-parser';
import billRoutes from "./routes/bill.route.js"
import {protectRoute} from './middlewares/auth.middleware.js';
import { connectDb } from "./lib/db.js";
import path from 'path';
import { fileURLToPath } from 'url';

const allowedOrigins = [
    "https://tmc-bill-website.onrender.com",
    "http://localhost:5173" // for development
  ];

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();

app.use(cors({
    origin: allowedOrigins,
    credentials: true
})); 

app.use(express.json());
app.use(cookieParser())

// Needed for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../bill-frontend/dist')));

// Fallback route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../bill-frontend/dis/index.html'));
});

app.use("/api/auth", authRoutes);
app.use(protectRoute)
app.use("/api/brand", brandRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/discount", discountRoutes);
// app.use("/api/gst", gstRoutes);
app.use("/api/party", partyRoutes);
app.use("/api/partyBrand", partyBrandRoutes);
// app.use("/api/partyCatalog", partyCatalogRoutes);
// app.use("/api/partyPricingSelection", partyPricingSelectionRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/sku", skuRoutes);
app.use("/api/specialdiscount", specialDiscountRoutes);
app.use("/api/bill",billRoutes);


app.listen(PORT, () => {
    connectDb();
    console.log("Server Running on Port: " + PORT);
});