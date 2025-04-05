import express from "express";
import {replaceBrandNamesWithIds} from "../controllers/temp.controller.js";
import { getParties, getPartiesById, addParty, updateParty, deleteParty } from "../controllers/party.controller.js";

const router = express.Router();

router.get("/", getParties);
router.get("/:id", getPartiesById);
router.get("/temp", replaceBrandNamesWithIds)
router.post("/add", addParty);
router.put("/update/:id", updateParty);
router.delete("/delete/:id", deleteParty);

export default router;
