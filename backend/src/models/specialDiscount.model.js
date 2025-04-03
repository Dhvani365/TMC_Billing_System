import mongoose from 'mongoose';

const SpecialDiscountSchema = new mongoose.Schema({
    party_id: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    catalog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog", required: true },
    discount: { type: mongoose.Types.Decimal128, default: 0 },
    status: { type: Boolean, default: true }, // true = active, false = inactive
    price_type: { type: String, enum: ["WSR", "CP"], default: "WSR" },
    // event_name: { type: String, required: true },
    // start_date: { type: Date, required: true },
    // end_date: { type: Date, required: true },
},{ indexes: [{ unique: true, fields: { party_id: 1, brand_id: 1, catalog_id: 1, event_name: 1 } }] });

export default mongoose.model("SpecialDiscount", SpecialDiscountSchema);