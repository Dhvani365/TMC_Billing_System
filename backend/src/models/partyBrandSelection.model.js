import mongoose from 'mongoose';

const PartyBrandRelationDataSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    default_price: { type: String, enum: ["WSR", "CP"], default: "WSR" },
    discount: { type: Number, default: 0 },
}, { indexes: [{ unique: true, fields: { party_id: 1, brand_id: 1 } }] });

export default mongoose.model('PartyBrandRelationData', PartyBrandRelationDataSchema);
