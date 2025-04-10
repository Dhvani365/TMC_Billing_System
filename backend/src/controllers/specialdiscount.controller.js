import SpecialDiscountModel from "../models/specialDiscount.model.js";
import mongoose from "mongoose";

// Get all special discounts
export const getSpecialDiscounts = async (req, res) => {
  try {
    const specialDiscounts = await SpecialDiscountModel.find().populate("party_id brand_id catalog_id");
    res.status(200).json(specialDiscounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching special discounts", error: error.message });
  }
};

// Get special discount by ID
export const getSpecialDiscountById = async (req, res) => {
  try {
    const specialDiscount = await SpecialDiscountModel.findById(req.params.id).populate("party_id brand_id catalog_id");
    if (!specialDiscount) {
      return res.status(404).json({ message: "Special discount not found" });
    }
    res.status(200).json(specialDiscount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching special discount", error: error.message });
  }
};

// Add new special discount
export const addSpecialDiscount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { party_id, brand_id, catalog_id, discount, status, price_type } = req.body;

    const validPriceTypes = ["WSR", "CP", "Fixed Price"];
    if (!validPriceTypes.includes(price_type)) {
      return res.status(400).json({ message: "Invalid price type" });
    }
    // Check if a similar special discount already exists
    const existingDiscount = await SpecialDiscountModel.findOne({
      party_id,
      brand_id,
      catalog_id,
      status
    }).session(session);

    if (existingDiscount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Special discount already exists for this party, brand, catalog, and price type" });
    }

    // Create the special discount
    const newSpecialDiscount = new SpecialDiscountModel({
      party_id,
      brand_id,
      catalog_id,
      discount,
      status,
      price_type
    });

    const savedSpecialDiscount = await newSpecialDiscount.save({ session });

    await session.commitTransaction();
    res.status(201).json(savedSpecialDiscount);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error creating special discount", error: error.message });
  } finally {
    session.endSession();
  }
};

// Update special discount
export const updateSpecialDiscount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { party_id, brand_id, catalog_id, discount, status, price_type } = req.body;

    // Check if a similar special discount already exists for another record
    const existingDiscount = await SpecialDiscountModel.findOne({
      _id: { $ne: req.params.id },
      party_id,
      brand_id,
      catalog_id,
      status,
    }).session(session);

    if (existingDiscount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Special discount already exists for this party, brand, catalog, and event" });
    }

    // Update the special discount
    const updatedSpecialDiscount = await SpecialDiscountModel.findByIdAndUpdate(
      req.params.id,
      {
        party_id,
        brand_id,
        catalog_id,
        discount,
        status,
        price_type,
      },
      { new: true, runValidators: true, session }
    );

    if (!updatedSpecialDiscount) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Special discount not found" });
    }

    await session.commitTransaction();
    res.status(200).json(updatedSpecialDiscount);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error updating special discount", error: error.message });
  } finally {
    session.endSession();
  }
};

// Delete special discount
export const deleteSpecialDiscount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete the special discount
    const deletedSpecialDiscount = await SpecialDiscountModel.findByIdAndDelete(req.params.id).session(session);
    if (!deletedSpecialDiscount) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Special discount not found" });
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Special discount deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error deleting special discount", error: error.message });
  } finally {
    session.endSession();
  }
};