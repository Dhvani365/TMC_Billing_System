import Party from '../models/party.model.js';

// Get all parties
export const getParties = async (req, res) => {
    try {
        const parties = await Party.find()
            .populate('selected_brands', 'name')
            .populate('selected_catalogs', 'name');
        res.status(200).json(parties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching parties", error: error.message });
    }
};

// Get party by ID
export const getPartyById = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id)
            .populate('selected_brands', 'name')
            .populate('selected_catalogs', 'name');
            
        if (!party) {
            return res.status(404).json({ message: "Party not found" });
        }
        
        res.status(200).json(party);
    } catch (error) {
        res.status(500).json({ message: "Error fetching party", error: error.message });
    }
};

// Add new party
export const addParty = async (req, res) => {
    try {
        const { name, gst_no, address, preferred_courier, selected_brands, selected_catalogs } = req.body;

        // Check if GST number already exists
        const existingParty = await Party.findOne({ gst_no });
        if (existingParty) {
            return res.status(400).json({ message: "Party with this GST number already exists" });
        }

        const newParty = new Party({
            name,
            gst_no,
            address,
            preferred_courier,
            selected_brands,
            selected_catalogs
        });

        const savedParty = await newParty.save();
        const populatedParty = await savedParty
            .populate('selected_brands', 'name')
            .populate('selected_catalogs', 'name');

        res.status(201).json(populatedParty);
    } catch (error) {
        res.status(500).json({ message: "Error creating party", error: error.message });
    }
};

// Update party
export const updateParty = async (req, res) => {
    try {
        const { name, gst_no, address, preferred_courier, selected_brands, selected_catalogs } = req.body;

        // Check if new GST number already exists for another party
        const existingParty = await Party.findOne({
            gst_no,
            _id: { $ne: req.params.id }
        });

        if (existingParty) {
            return res.status(400).json({ message: "Party with this GST number already exists" });
        }

        const updatedParty = await Party.findByIdAndUpdate(
            req.params.id,
            {
                name,
                gst_no,
                address,
                preferred_courier,
                selected_brands,
                selected_catalogs
            },
            { new: true, runValidators: true }
        )
            .populate('selected_brands', 'name')
            .populate('selected_catalogs', 'name');

        if (!updatedParty) {
            return res.status(404).json({ message: "Party not found" });
        }

        res.status(200).json(updatedParty);
    } catch (error) {
        res.status(500).json({ message: "Error updating party", error: error.message });
    }
};

// Delete party
export const deleteParty = async (req, res) => {
    try {
        const deletedParty = await Party.findByIdAndDelete(req.params.id);
        
        if (!deletedParty) {
            return res.status(404).json({ message: "Party not found" });
        }

        res.status(200).json({ message: "Party deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting party", error: error.message });
    }
};