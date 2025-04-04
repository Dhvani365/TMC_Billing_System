import PartyBrandSelection from '../models/partyBrandSelection.model.js';

// Get all party brand selections
export const getPartyBrands = async (req, res) => {
    try {
        const partyBrands = await PartyBrandSelection.find()
        res.status(200).json(partyBrands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party brand selections", error: error.message });
    }
};

// Get party brand selections by party
export const getPartyBrandByParty = async (req, res) => {
    try {
        const partyBrands = await PartyBrandSelection.find({ party: req.params.party_id })
            .populate('party', 'name')
            .populate('brand', 'name');
        res.status(200).json(partyBrands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party brand selections", error: error.message });
    }
};

// Add new party brand selection
export const addPartyBrand = async (req, res) => {
    try {
        const { party, brand } = req.body;

        // Check if selection already exists
        const existingSelection = await PartyBrandSelection.findOne({ party, brand });
        if (existingSelection) {
            return res.status(400).json({ message: "Party brand selection already exists" });
        }

        const newPartyBrand = new PartyBrandSelection({ party, brand });
        const savedPartyBrand = await newPartyBrand.save();
        const populatedPartyBrand = await savedPartyBrand
            .populate('party', 'name')
            .populate('brand', 'name');

        res.status(201).json(populatedPartyBrand);
    } catch (error) {
        res.status(500).json({ message: "Error creating party brand selection", error: error.message });
    }
};

// Delete party brand selection
export const deletePartyBrand = async (req, res) => {
    try {
        const { party_id, brand_id } = req.params;
        
        const deletedPartyBrand = await PartyBrandSelection.findOneAndDelete({
            party: party_id,
            brand: brand_id
        });
        
        if (!deletedPartyBrand) {
            return res.status(404).json({ message: "Party brand selection not found" });
        }

        res.status(200).json({ message: "Party brand selection deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting party brand selection", error: error.message });
    }
};