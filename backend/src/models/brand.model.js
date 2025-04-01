import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    gst_rate: { type: mongoose.Types.Decimal128, required: true },
    image: { data: Buffer, contentType: String }, // Stores image as binary data
});

export default mongoose.model("Brand", BrandSchema);