import express from "express";
import { getDiscountByPartyAndBrandAndCatalog } from "../controllers/discount.controller.js";

const router = express.Router();

// router.get("/", getDiscounts);
// router.get("/:party_id", getDiscountByParty);
router.get("/:party_id/:brand_id/:catalog_id", getDiscountByPartyAndBrandAndCatalog);    
// router.post("/add", addDiscount);
// router.put("/update/:party_id/:brand_id/:catalog_id", updateDiscount);
// router.delete("/delete/:party_id/:brand_id/:catalog_id", deleteDiscount);

export default router;
