import express from "express";
import { getPartyBrands, getPartyBrandByParty, addPartyBrand, deletePartyBrand } from "../controllers/partyBrand.controller.js";

const router = express.Router();

router.get("/", getPartyBrands);
router.get("/:party_id", getPartyBrandByParty);
router.post("/add", addPartyBrand);
router.delete("/delete/:party_id/:brand_id", deletePartyBrand);

export default router;
