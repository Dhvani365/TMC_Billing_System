import mongoose from 'mongoose';

const CatalogSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }  // Catalog-level pricing
});

export default mongoose.model('Catalog', CatalogSchema);