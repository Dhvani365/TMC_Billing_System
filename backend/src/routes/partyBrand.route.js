import express from "express";
import { getPartyBrands, getPartyBrandByParty, addPartyBrand, deletePartyBrand,updatePartyBrand } from "../controllers/partyBrand.controller.js";

const router = express.Router();

// router.get("/", getPartyBrands);//See if you want the partybrand add and delete route for when party add logic
router.get("/:party_id", getPartyBrandByParty);
router.post("/add", addPartyBrand);
router.post("/update", updatePartyBrand);
router.delete("/delete/:party_id/:brand_id", deletePartyBrand);

export default router;
