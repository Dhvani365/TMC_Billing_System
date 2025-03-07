import mongoose from 'mongoose';

const PricingSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, unique: true },
    wsp: { type: Number, required: true },  // Wholesale Price
    cp: { type: Number, required: true }    // Consumer Price
});

export default mongoose.model('Pricing', PricingSchema);