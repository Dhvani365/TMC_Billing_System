import Bill from "../models/bill.model.js";
import mongoose from "mongoose";

// Get all bills
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bills", error: err.message });
  }
};

// Get bill by ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json(bill);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bill", error: err.message });
  }
};

// Get bills by Party ID
export const getBillByPartyId = async (req, res) => {
  try {
    const bills = await Bill.find({ partyId: req.params.id }).sort({ date: -1 });
    if (!bills || bills.length === 0) {
      return res.status(404).json({ message: "No bills found for this party" });
    }
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bills by party", error: err.message });
  }
};

// Add new bill
export const addBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Check for duplicate invoiceNumber for the same partyId
    const exists = await Bill.exists({
      partyId: req.body.partyId,
      invoiceNumber: req.body.invoiceNumber
    }).session(session);

    if (exists) {
      await session.abortTransaction();
      return res.status(400).json({ message: "A bill with this invoice number already exists for this party." });
    }
    
    // Create and save the bill
    const bill = new Bill(req.body);
    
    // Add createdBy if user info is available from auth middleware
    if (req.user) {
      bill.createdBy = req.user._id;
    }
    
    await bill.save({ session });
    await session.commitTransaction();
    res.status(201).json(bill);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: "Error creating bill", error: err.message });
  } finally {
    session.endSession();
  }
};

// Update bill
export const updateBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // If invoice number is being changed, check for duplicates
    if (req.body.invoiceNumber) {
      const exists = await Bill.exists({
        partyId: req.body.partyId || (await Bill.findById(req.params.id)).partyId,
        invoiceNumber: req.body.invoiceNumber,
        _id: { $ne: req.params.id }
      }).session(session);

      if (exists) {
        await session.abortTransaction();
        return res.status(400).json({ message: "A bill with this invoice number already exists for this party." });
      }
    }
    
    // Add updatedBy if user info is available
    if (req.user) {
      req.body.updatedBy = req.user._id;
    }
    
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, session }
    );
    
    if (!bill) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bill not found" });
    }
    
    await session.commitTransaction();
    res.status(200).json(bill);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: "Error updating bill", error: err.message });
  } finally {
    session.endSession();
  }
};

// Delete bill
export const deleteBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id).session(session);
    
    if (!bill) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bill not found" });
    }
    
    await session.commitTransaction();
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error deleting bill", error: err.message });
  } finally {
    session.endSession();
  }
};
