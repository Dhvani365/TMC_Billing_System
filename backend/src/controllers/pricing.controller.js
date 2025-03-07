import Pricing from '../models/pricing.model.js';

// Get all pricing entries
export const getPricing = async (req, res) => {
    try {
        const pricing = await Pricing.find().populate('brand', 'name');
        res.status(200).json(pricing);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pricing", error: error.message });
    }
};

// Get pricing by brand
export const getPricingByBrand = async (req, res) => {
    try {
        const pricing = await Pricing.findOne({ brand: req.params.brand_id })
            .populate('brand', 'name');
            
        if (!pricing) {
            return res.status(404).json({ message: "Pricing not found for this brand" });
        }
        
        res.status(200).json(pricing);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pricing", error: error.message });
    }
};

// Add new pricing
export const addPricing = async (req, res) => {
    try {
        const { brand, wsp, cp } = req.body;

        // Check if pricing already exists for this brand
        const existingPricing = await Pricing.findOne({ brand });
        if (existingPricing) {
            return res.status(400).json({ message: "Pricing already exists for this brand" });
        }

        const newPricing = new Pricing({ brand, wsp, cp });
        const savedPricing = await newPricing.save();
        const populatedPricing = await savedPricing.populate('brand', 'name');

        res.status(201).json(populatedPricing);
    } catch (error) {
        res.status(500).json({ message: "Error creating pricing", error: error.message });
    }
};

// Update pricing
export const updatePricing = async (req, res) => {
    try {
        const { wsp, cp } = req.body;

        const updatedPricing = await Pricing.findOneAndUpdate(
            { brand: req.params.brand_id },
            { wsp, cp },
            { new: true, runValidators: true }
        ).populate('brand', 'name');

        if (!updatedPricing) {
            return res.status(404).json({ message: "Pricing not found" });
        }

        res.status(200).json(updatedPricing);
    } catch (error) {
        res.status(500).json({ message: "Error updating pricing", error: error.message });
    }
};

// Delete pricing
export const deletePricing = async (req, res) => {
    try {
        const deletedPricing = await Pricing.findOneAndDelete({ brand: req.params.brand_id });
        
        if (!deletedPricing) {
            return res.status(404).json({ message: "Pricing not found" });
        }

        res.status(200).json({ message: "Pricing deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pricing", error: error.message });
    }
};