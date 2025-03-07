import express from "express";
import { getDiscounts, getDiscountByParty, getDiscountByPartyAndBrand, addDiscount, updateDiscount, deleteDiscount } from "../controllers/discount.controller.js";

const router = express.Router();

router.get("/", getDiscounts);
router.get("/:party_id", getDiscountByParty);
router.get("/:party_id/:brand_id/", getDiscountByPartyAndBrand);
router.post("/add", addDiscount);
router.put("/update/:party_id/:brand_id/:catalog_id", updateDiscount);
router.delete("/delete/:party_id/:brand_id/:catalog_id", deleteDiscount);

export default router;
