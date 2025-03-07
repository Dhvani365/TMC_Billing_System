import PartyPricingSelection from '../models/partyPricingSelection.model.js';

// Get all party pricing selections
export const getPartyPricingSelections = async (req, res) => {
    try {
        const { party, brand } = req.body;
        
        // Create a filter object based on provided parameters
        const filter = {};
        if (party) filter.party = party;
        if (brand) filter.brand = brand;
        
        const partyPricingSelections = await PartyPricingSelection.find(filter)
            .populate('party', 'name')
            .populate('brand', 'name');
            
        res.status(200).json(partyPricingSelections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party pricing selections", error: error.message });
    }
};

// Data format: {
//     "party": "party_id", // Optional - MongoDB ObjectId as string
//     "brand": "brand_id"  // Optional - MongoDB ObjectId as string
// }

// Get party pricing selections by party
export const getPartyPricingSelectionByParty = async (req, res) => {
    try {
        
        const partyPricingSelections = await PartyPricingSelection.find({ party: req.params.party_id })
            .populate('party', 'name')
            .populate('brand', 'name');
        
        if (!partyPricingSelections) {
            return res.status(404).json({ message: "No pricing selections found for this party" });
        }

        res.status(200).json(partyPricingSelections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party pricing selections", error: error.message });
    }
};

// /api/party-pricing-selections/:party_id

// Add new party pricing selection
export const addPartyPricingSelection = async (req, res) => {
    try {
        const { party, brand, default_price } = req.body;

        // Validate default_price is either 'WSP' or 'CP'
        if (!['WSP', 'CP'].includes(default_price)) {
            return res.status(400).json({ message: "default_price must be either 'WSP' or 'CP'" });
        }

        // Check if selection already exists
        const existingSelection = await PartyPricingSelection.findOne({ party, brand });
        if (existingSelection) {
            return res.status(400).json({ message: "Pricing selection already exists for this party and brand" });
        }

        const newPartyPricingSelection = new PartyPricingSelection({ 
            party, 
            brand, 
            default_price 
        });
        
        const savedSelection = await newPartyPricingSelection.save();
        const populatedSelection = await savedSelection
            .populate('party', 'name')
            .populate('brand', 'name');

        res.status(201).json(populatedSelection);
    } catch (error) {
        res.status(500).json({ message: "Error creating party pricing selection", error: error.message });
    }
};

// {
//     "party": "party_id",       // Required - MongoDB ObjectId as string
//     "brand": "brand_id",       // Required - MongoDB ObjectId as string
//     "default_price": "WSP"     // Required - Must be either "WSP" or "CP"
//   }

// Update party pricing selection
export const updatePartyPricingSelection = async (req, res) => {
    try {
        const { default_price } = req.body;
        const { party_id } = req.params;

        // Validate default_price is either 'WSP' or 'CP'
        if (!['WSP', 'CP'].includes(default_price)) {
            return res.status(400).json({ message: "default_price must be either 'WSP' or 'CP'" });
        }

        const updatedSelection = await PartyPricingSelection.findOneAndUpdate(
            { party: party_id },
            { default_price },
            { new: true, runValidators: true }
        )
            .populate('party', 'name')
            .populate('brand', 'name');

        if (!updatedSelection) {
            return res.status(404).json({ message: "Party pricing selection not found" });
        }

        res.status(200).json(updatedSelection);
    } catch (error) {
        res.status(500).json({ message: "Error updating party pricing selection", error: error.message });
    }
};

// {
//     "default_price": "CP"      // Required - Must be either "WSP" or "CP"
//   }

// Delete party pricing selection
export const deletePartyPricingSelection = async (req, res) => {
    try {
        const { party_id } = req.params;
        
        const deletedSelection = await PartyPricingSelection.findOneAndDelete({
            party: party_id
        });
        
        if (!deletedSelection) {
            return res.status(404).json({ message: "Party pricing selection not found" });
        }

        res.status(200).json({ message: "Party pricing selection deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting party pricing selection", error: error.message });
    }
};

// /api/party-pricing-selections/:party_id