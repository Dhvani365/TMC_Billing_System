import mongoose from 'mongoose';

const SkuSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true },
    sku_number: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    image: { data: Buffer, contentType: String }, // Stores image as binary data
});

export default mongoose.model('SKU', SkuSchema);