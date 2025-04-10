import mongoose from 'mongoose';

const SpecialDiscountSchema = new mongoose.Schema({
    party_id: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    catalog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog", required: true },
    discount: { type: Number, default: 0 },
    status: { type: Boolean, default: true }, // true = active, false = inactive
    price_type: { type: String, enum: ["WSR", "CP", "Fixed Price"], default: "WSR" },
},{ indexes: [{ unique: true, fields: { party_id: 1, brand_id: 1, catalog_id: 1, status: 1 } }] });

export default mongoose.model("SpecialDiscount", SpecialDiscountSchema);