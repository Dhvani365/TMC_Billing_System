import mongoose from 'mongoose';

const PartyPricingSelectionSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    default_price: { type: String, enum: ['WSP', 'CP'], default: 'WSP' }  // WSP or CP selection
}, { unique: ['party', 'brand'] });

export default mongoose.model('PartyPricingSelection', PartyPricingSelectionSchema);