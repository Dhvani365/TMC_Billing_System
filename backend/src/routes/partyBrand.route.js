import express from "express";
import { getPartyBrands, getPartyBrandByParty, addPartyBrand, deletePartyBrand, getSelectedBrandsByParty } from "../controllers/partyBrand.controller.js";

const router = express.Router();

router.get("/", getPartyBrands);
// router.get("/:party_id", getPartyBrandByParty);
router.get("/selected_brands/:party_id", getPartyBrandByParty); // New route
router.post("/add", addPartyBrand);
router.delete("/delete/:party_id/:brand_id", deletePartyBrand);

export default router;