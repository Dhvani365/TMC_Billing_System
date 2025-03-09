import GST from '../models/gst.model.js';

// Get all GST entries
export const getGST = async (req, res) => {
    try {
        const gstEntries = await GST.find().populate('sku', 'sku_number');
        res.status(200).json(gstEntries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching GST entries", error: error.message });
    }
};

// Get GST by SKU
export const getGSTBySKU = async (req, res) => {
    try {
        const gst = await GST.findOne({ sku: req.params.sku_id })
            .populate('sku', 'sku_number');
            
        if (!gst) {
            return res.status(404).json({ message: "GST entry not found for this SKU" });
        }
        
        res.status(200).json(gst);
    } catch (error) {
        res.status(500).json({ message: "Error fetching GST entry", error: error.message });
    }
};

// Add new GST entry
export const addGST = async (req, res) => {
    try {
        const { sku, gst_rate } = req.body;

        // Check if GST entry already exists for this SKU
        const existingGST = await GST.findOne({ sku });
        if (existingGST) {
            return res.status(400).json({ message: "GST entry already exists for this SKU" });
        }

        const newGST = new GST({ sku, gst_rate });
        const savedGST = await newGST.save();
        
        const populatedGST = await savedGST.populate('sku', 'sku_number');
        res.status(201).json(populatedGST);
    } catch (error) {
        res.status(500).json({ message: "Error creating GST entry", error: error.message });
    }
};

// Update GST
export const updateGST = async (req, res) => {
    try {
        const { gst_rate } = req.body;

        const updatedGST = await GST.findOneAndUpdate(
            { sku: req.params.sku_id },
            { gst_rate },
            { new: true, runValidators: true }
        ).populate('sku', 'sku_number');

        if (!updatedGST) {
            return res.status(404).json({ message: "GST entry not found" });
        }

        res.status(200).json(updatedGST);
    } catch (error) {
        res.status(500).json({ message: "Error updating GST entry", error: error.message });
    }
};

// Delete GST
export const deleteGST = async (req, res) => {
    try {
        const deletedGST = await GST.findOneAndDelete({ sku: req.params.sku_id });
        
        if (!deletedGST) {
            return res.status(404).json({ message: "GST entry not found" });
        }

        res.status(200).json({ message: "GST entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting GST entry", error: error.message });
    }
};