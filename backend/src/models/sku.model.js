import mongoose from 'mongoose';

const SkuSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true },
    sku_number: { type: String, required: true },
    // price: { type: Number, required: true },
    wsr_price: { type: mongoose.Types.Decimal128},
    cp_price: { type: mongoose.Types.Decimal128 },
    image: { data: Buffer, contentType: String }, // Stores image as binary data
});

// Add a compound index to ensure uniqueness for brand, catalog, and sku_number
SkuSchema.index({ brand: 1, catalog: 1, sku_number: 1 }, { unique: true });

export default mongoose.model('SKU', SkuSchema); // Use 'SKU' as the model name