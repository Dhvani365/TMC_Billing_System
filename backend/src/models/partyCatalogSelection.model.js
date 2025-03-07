import mongoose from 'mongoose';

const PartyCatalogSelectionSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true }
}, { unique: ['party', 'catalog'] });

export default mongoose.model('PartyCatalogSelection', PartyCatalogSelectionSchema);