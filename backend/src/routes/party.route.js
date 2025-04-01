import express from "express";
import { getParties, getPartyById, addParty, updateParty, deleteParty } from "../controllers/party.controller.js";

const router = express.Router();

router.get("/", getParties);//
router.get("/:id", getPartyById);
router.post("/add", addParty);
router.put("/update/:id", updateParty);
router.delete("/delete/:id", deleteParty);

export default router;
