import express from "express";
import { getCatalogById, addCatalog, updateCatalog, deleteCatalog ,getCatalogsByBrand } from "../controllers/catalog.controller.js";

const router = express.Router();

// router.get("/", getCatalogs);
router.get("/:id", getCatalogById);
router.get("/brandid/:id", getCatalogsByBrand);
router.post("/add", addCatalog);
router.put("/update/:id", updateCatalog);
router.delete("/delete/:id", deleteCatalog);

export default router;
