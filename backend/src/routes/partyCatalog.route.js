import express from "express";
import { getPartyCatalogs, getPartyCatalogByParty, addPartyCatalog, deletePartyCatalog } from "../controllers/partyCatalog.controller.js";

const router = express.Router();

router.get("/", getPartyCatalogs);
router.get("/:party_id", getPartyCatalogByParty);
router.post("/add", addPartyCatalog);
router.delete("/delete/:party_id/:catalog_id", deletePartyCatalog);

export default router;
