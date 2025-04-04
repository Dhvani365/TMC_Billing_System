import Brand from '../models/brand.model.js';
import partyBrandSelectionModel from '../models/partyBrandSelection.model.js';
import skuModel from '../models/sku.model.js';
import catalogModel from '../models/catalog.model.js';
import SpecialDiscountModel from '../models/specialDiscount.model.js';


// Get all brands
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brands", error: error.message });
    }
};

// Get brand by ID
export const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brand", error: error.message });
    }
};

// Add new brand
export const addBrand = async (req, res) => {
    try {
        const { name, gst_rate, available_prices} = req.body;
        // Check if brand already exists
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: "Brand already exists" });
        }
        
        const newBrand = new Brand({ name, gst_rate, available_prices});
        const savedBrand = await newBrand.save();
        
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error: error.message });
    }
};

// Update brand
export const updateBrand = async (req, res) => {
    try {
        const { name , gst_rate, available_prices} = req.body;
        
        // Check if new name already exists for another brand
        const existingBrand = await Brand.findOne({ 
            name, 
            _id: { $ne: req.params.id } 
        });
        
        if (!existingBrand) {
            return res.status(400).json({ message: "Brand name does not already exists" });
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name , gst_rate,available_prices},
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedBrand);
    } catch (error) {
        return res.status(500).json({ message: "Error updating brand", error: error.message });
    }
};

// Delete brand
export const deleteBrand = async (req, res) => {
    try {
        const deletedsku = await skuModel.deleteMany({brand: req.params.id});
        const deletedpartyBrandSelection = await partyBrandSelectionModel.deleteMany({brand: req.params.id});
        const deletedcatalog = await catalogModel.deleteMany({brand: req.params.id});
        const deletedSpecialDiscount = await SpecialDiscountModel.deleteMany({brand_id: req.params.id});
        const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
        
        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting brand", error: error.message });
    }
};