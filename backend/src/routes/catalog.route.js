import express from "express";
import { getCatalogs, getCatalogById, addCatalog, updateCatalog, deleteCatalog } from "../controllers/catalog.controller.js";

const router = express.Router();

router.get("/", getCatalogs);
router.get("/:id", getCatalogById);
router.post("/add", addCatalog);
router.put("/update/:id", updateCatalog);
router.delete("/delete/:id", deleteCatalog);

export default router;
