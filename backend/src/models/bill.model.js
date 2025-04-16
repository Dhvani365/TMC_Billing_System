import mongoose from 'mongoose';

const BillItemSchema = new mongoose.Schema({
  skuId: { type: mongoose.Schema.Types.ObjectId, ref: "SKU", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number }, // optional
  total: { type: Number, required: true }
}, { _id: false });

const BillSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  party: {
    name: { type: String, required: true },
    address: { type: String },
    gstin: { type: String },
    state: { type: String },
    stateCode: { type: String }
  },
  items: [BillItemSchema],
  totalAmount: { type: Number, required: true },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
  roundOff: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Add compound index to prevent duplicate invoice numbers for the same party
BillSchema.index({ partyId: 1, invoiceNumber: 1 }, { unique: true });

export default mongoose.model("Bill", BillSchema);
