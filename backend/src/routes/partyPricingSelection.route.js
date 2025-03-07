import express from "express";
import { getPartyPricingSelections, getPartyPricingSelectionByParty, addPartyPricingSelection, updatePartyPricingSelection, deletePartyPricingSelection } from "../controllers/partyPricingSelection.controller.js";

const router = express.Router();

router.get("/", getPartyPricingSelections);
router.get("/:party_id", getPartyPricingSelectionByParty);
router.post("/add", addPartyPricingSelection);
router.put("/update/:party_id", updatePartyPricingSelection);
router.delete("/delete/:party_id", deletePartyPricingSelection);

export default router;
