import mongoose from 'mongoose';

const PartyBrandSelectionSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true }
}, { unique: ['party', 'brand'] });

export default mongoose.model('PartyBrandSelection', PartyBrandSelectionSchema);
