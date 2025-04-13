import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import brandRoutes from "./routes/brand.route.js"
import catalogRoutes from "./routes/catalog.route.js"
import discountRoutes from "./routes/discount.route.js"
import partyRoutes from "./routes/party.route.js"
import partyBrandRoutes from "./routes/partyBrand.route.js"
import pricingRoutes from "./routes/pricing.route.js"
import skuRoutes from "./routes/sku.route.js"
import specialDiscountRoutes from "./routes/specialdiscount.route.js"
import {connectDb} from "./lib/db.js"
 
dotenv.config({path : '../.env'});
const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL
const app = express();

// app.use(cors({
//     origin: FRONTEND_URL,
//     credentials: true
//   } ));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../bill-frontend/dist')));

// Handle requests by serving index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../bill-frontend/dist', 'index.html'));
});

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/brand",brandRoutes);
app.use("/api/catalog",catalogRoutes);
app.use("/api/discount",discountRoutes);
// app.use("/api/gst",gstRoutes);
app.use("/api/party",partyRoutes);
app.use("/api/partyBrand",partyBrandRoutes);
// app.use("/api/partyCatalog",partyCatalogRoutes);
// app.use("/api/partyPricingSelection",partyPricingSelectionRoutes);
app.use("/api/pricing",pricingRoutes);
app.use("/api/sku",skuRoutes);
app.use("/api/specialdiscount",specialDiscountRoutes);

app.listen(PORT, () => {
    connectDb()
    console.log("Server Running on Port: " + PORT)
});