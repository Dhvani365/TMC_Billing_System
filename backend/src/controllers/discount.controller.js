import Discount from '../models/discount.model.js';

// Get all discounts
export const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find()
            .populate('party', 'name')
            .populate('brand', 'name')
            .populate('catalog', 'name');
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching discounts", error: error.message });
    }
};

// Get discounts by party
export const getDiscountByParty = async (req, res) => {
    try {
        const discounts = await Discount.find({ party: req.params.party_id })
            .populate('party', 'name')
            .populate('brand', 'name')
            .populate('catalog', 'name');
            
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching discounts", error: error.message });
    }
};

// Get discounts by party and brand
export const getDiscountByPartyAndBrand = async (req, res) => {
    try {
        const discounts = await Discount.find({
            party: req.params.party_id,
            brand: req.params.brand_id
        })
            .populate('party', 'name')
            .populate('brand', 'name')
            .populate('catalog', 'name');
            
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching discounts", error: error.message });
    }
};

// Add new discount
export const addDiscount = async (req, res) => {
    try {
        const { party, brand, catalog, wsp_discount, cp_discount } = req.body;

        // Check if discount already exists
        const existingDiscount = await Discount.findOne({ party, brand, catalog });
        if (existingDiscount) {
            return res.status(400).json({ message: "Discount already exists for this combination" });
        }

        const newDiscount = new Discount({
            party,
            brand,
            catalog,
            wsp_discount,
            cp_discount
        });

        const savedDiscount = await newDiscount.save();
        const populatedDiscount = await savedDiscount
            .populate('party', 'name')
            .populate('brand', 'name')
            .populate('catalog', 'name');

        res.status(201).json(populatedDiscount);
    } catch (error) {
        res.status(500).json({ message: "Error creating discount", error: error.message });
    }
};

// Update discount
export const updateDiscount = async (req, res) => {
    try {
        const { wsp_discount, cp_discount } = req.body;
        const { party_id, brand_id, catalog_id } = req.params;

        const updatedDiscount = await Discount.findOneAndUpdate(
            { 
                party: party_id,
                brand: brand_id,
                catalog: catalog_id
            },
            { wsp_discount, cp_discount },
            { new: true, runValidators: true }
        )
            .populate('party', 'name')
            .populate('brand', 'name')
            .populate('catalog', 'name');

        if (!updatedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.status(200).json(updatedDiscount);
    } catch (error) {
        res.status(500).json({ message: "Error updating discount", error: error.message });
    }
};

// Delete discount
export const deleteDiscount = async (req, res) => {
    try {
        const { party_id, brand_id, catalog_id } = req.params;

        const deletedDiscount = await Discount.findOneAndDelete({
            party: party_id,
            brand: brand_id,
            catalog: catalog_id
        });
        
        if (!deletedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting discount", error: error.message });
    }
};