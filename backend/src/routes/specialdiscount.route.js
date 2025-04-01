import express from "express";
import { getSpecialDiscounts, getSpecialDiscountById, addSpecialDiscount, updateSpecialDiscount, deleteSpecialDiscount } from "../controllers/specialdiscount.controller.js";

const router = express.Router();

router.get("/", getSpecialDiscounts);
router.get("/:id", getSpecialDiscountById);
router.post("/add", addSpecialDiscount);
router.put("/update/:id", updateSpecialDiscount); //Status or something
router.delete("/delete/:id", deleteSpecialDiscount);

export default router;
