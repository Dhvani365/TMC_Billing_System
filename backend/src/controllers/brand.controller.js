import Brand from '../models/brand.model.js';

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
        const { name } = req.body;
        const image = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        };
        // Check if brand already exists
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: "Brand already exists" });
        }
        
        const newBrand = new Brand({ name, image});
        const savedBrand = await newBrand.save();
        
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error: error.message });
    }
};

// Update brand
export const updateBrand = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check if new name already exists for another brand
        const existingBrand = await Brand.findOne({ 
            name, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingBrand) {
            return res.status(400).json({ message: "Brand name already exists" });
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(500).json({ message: "Error updating brand", error: error.message });
    }
};

// Delete brand
export const deleteBrand = async (req, res) => {
    try {
        const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
        
        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting brand", error: error.message });
    }
};