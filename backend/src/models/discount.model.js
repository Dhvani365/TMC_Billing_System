import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true },
    wsp_discount: { type: Number, default: 0 },
    cp_discount: { type: Number, default: 0 }
}, { unique: ['party', 'brand', 'catalog'] });

export default mongoose.model('Discount', DiscountSchema);