import mongoose from 'mongoose';

const GstSchema = new mongoose.Schema({
    sku: { type: mongoose.Schema.Types.ObjectId, ref: 'SKU', required: true },
    gst_rate: { type: Number, required: true }  // Example: 18.00 for 18%
});

export default mongoose.model('GST', GstSchema);
