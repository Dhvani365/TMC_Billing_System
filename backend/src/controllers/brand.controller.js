import Brand from '../models/brand.model.js';
import partyBrandSelectionModel from '../models/partyBrandSelection.model.js';
import skuModel from '../models/sku.model.js';
import catalogModel from '../models/catalog.model.js';
import SpecialDiscountModel from '../models/specialDiscount.model.js';
import mongoose from 'mongoose';

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
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { name, gst_rate, available_prices } = req.body;
  
      // Check if brand already exists
      const existingBrand = await Brand.findOne({ name }).session(session);
      if (existingBrand) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Brand already exists" });
      }
  
      // Create the brand
      const newBrand = new Brand({ name, gst_rate, available_prices });
      const savedBrand = await newBrand.save({ session });
  
      await session.commitTransaction();
      res.status(201).json(savedBrand);
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: "Error creating brand", error: error.message });
    } finally {
      session.endSession();
    }
  };

// Update brand
export const updateBrand = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { name, gst_rate, available_prices } = req.body;
  
      // Update the brand
      const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        { name, gst_rate, available_prices },
        { new: true, runValidators: true, session }
      );
  
      if (!updatedBrand) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Brand not found" });
      }
  
      await session.commitTransaction();
      res.status(200).json(updatedBrand);
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: "Error updating brand", error: error.message });
    } finally {
      session.endSession();
    }
  };

// Delete brand
export const deleteBrand = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Delete related data
      await skuModel.deleteMany({ brand: req.params.id }).session(session);
      await partyBrandSelectionModel.deleteMany({ brand: req.params.id }).session(session);
      await catalogModel.deleteMany({ brand: req.params.id }).session(session);
      await SpecialDiscountModel.deleteMany({ brand_id: req.params.id }).session(session);
  
      // Delete the brand
      const deletedBrand = await Brand.findByIdAndDelete(req.params.id).session(session);
      if (!deletedBrand) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Brand not found" });
      }
  
      await session.commitTransaction();
      res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: "Error deleting brand", error: error.message });
    } finally {
      session.endSession();
    }
  };