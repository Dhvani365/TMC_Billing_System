import mongoose from 'mongoose';

const PartySchema = new mongoose.Schema({
    name: { type: String, required: true },
    gst_no: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    preferred_courier: { type: String },
    selected_brands: [{ type: String }], // Ensure this field is included
    selected_catalogs: [{ type: String }],
});

export default mongoose.model('Party', PartySchema);