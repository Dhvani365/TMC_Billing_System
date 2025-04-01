import mongoose from 'mongoose';

const PartySchema = new mongoose.Schema({
    name: { type: String, required: true },
    gst_no: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    preferred_courier: { type: String },
    // selected_brands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],  // Relationship with Brands
    // selected_catalogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Catalog' }] // Relationship with Catalogs
});

export default mongoose.model('Party', PartySchema);
