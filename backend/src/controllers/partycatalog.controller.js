import PartyCatalogSelection from '../models/partyCatalogSelection.model.js';

// Get all party catalog selections
export const getPartyCatalogs = async (req, res) => {
    try {
        const partyCatalogs = await PartyCatalogSelection.find()
            .populate('party', 'name')
            .populate('catalog', 'name');
        res.status(200).json(partyCatalogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party catalog selections", error: error.message });
    }
};

// Get party catalog selections by party
export const getPartyCatalogByParty = async (req, res) => {
    try {
        const partyCatalogs = await PartyCatalogSelection.find({ party: req.params.party_id })
            .populate('party', 'name')
            .populate('catalog', 'name');
        res.status(200).json(partyCatalogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party catalog selections", error: error.message });
    }
};

// Add new party catalog selection
export const addPartyCatalog = async (req, res) => {
    try {
        const { party, catalog } = req.body;

        // Check if selection already exists
        const existingSelection = await PartyCatalogSelection.findOne({ party, catalog });
        if (existingSelection) {
            return res.status(400).json({ message: "Party catalog selection already exists" });
        }

        const newPartyCatalog = new PartyCatalogSelection({ party, catalog });
        const savedPartyCatalog = await newPartyCatalog.save();
        const populatedPartyCatalog = await savedPartyCatalog
            .populate('party', 'name')
            .populate('catalog', 'name');

        res.status(201).json(populatedPartyCatalog);
    } catch (error) {
        res.status(500).json({ message: "Error creating party catalog selection", error: error.message });
    }
};

// Delete party catalog selection
export const deletePartyCatalog = async (req, res) => {
    try {
        const { party_id, catalog_id } = req.params;
        
        const deletedPartyCatalog = await PartyCatalogSelection.findOneAndDelete({
            party: party_id,
            catalog: catalog_id
        });
        
        if (!deletedPartyCatalog) {
            return res.status(404).json({ message: "Party catalog selection not found" });
        }

        res.status(200).json({ message: "Party catalog selection deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting party catalog selection", error: error.message });
    }
};