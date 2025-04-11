import mongoose from 'mongoose';

const CatalogSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true },
    no_of_skus: { type: Number, required: true },
    // price: { type: Number, required: true }  // Catalog-level pricing
});

// Add a compound index to ensure uniqueness for brand and name
CatalogSchema.index({ brand: 1, name: 1 }, { unique: true });

export default mongoose.model('Catalog', CatalogSchema);