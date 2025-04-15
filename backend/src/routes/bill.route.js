import express from "express";
import {getBills,getBillById,getBillByPartyId,addBill,updateBill,deleteBill} from "../controllers/bill.controller.js";

const router = express.Router();

router.get("/", getBills);                // Get all bills
router.get("/:id", getBillById);          // Get bill by ID
router.get("/party/:id", getBillByPartyId); // Get bills by Party ID
router.post("/add", addBill);             // Add new bill
router.put("/update/:id", updateBill);    // Update bill by ID
router.delete("/delete/:id", deleteBill); // Delete bill by ID

export default router;
