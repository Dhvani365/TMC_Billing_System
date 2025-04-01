import mongoose from 'mongoose';

const PartyBrandSelectionSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    default_price: { type: String, enum: ["WSR", "CP"], default: "WSR" },
}, { indexes: [{ unique: true, fields: { party_id: 1, brand_id: 1 } }] });

export default mongoose.model('PartyBrandSelection', PartyBrandSelectionSchema);
