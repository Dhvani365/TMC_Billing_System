import Party from '../models/party.model.js';
import PartyBrandRelationData from '../models/partyBrandSelection.model.js';
import mongoose from 'mongoose';
import specialDiscountModel from '../models/specialDiscount.model.js';
// Get all parties
export const getParties = async (req, res) => {
    try {
        const parties = await Party.find()
        res.status(200).json(parties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching parties", error: error.message });
    }
};

//get party by id
//send brand name
export const getPartiesById = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        const Relations = await PartyBrandRelationData.find({party:req.params.id}).populate('brand');
        res.status(200).json({party: party,
            relations: relations.map(rel => ({
                brand: rel.brand,
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching parties", error: error.message });
    }
};

// Add new party
//list_of_selected_brands = [{
                            // brand_id:,
                            // Pricing_type,
                            // discount:,
                            //     }]
export const addParty = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { name, gst_no, address, preferred_courier, list_of_selected_brands } = req.body;

        // Validate GST number uniqueness
        const existingParty = await Party.findOne({ gst_no }).session(session);
        if (existingParty) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Party with this GST number already exists" });
        }

        // Create party
        const newParty = await Party.create([{
            name,
            gst_no,
            address,
            preferred_courier,
        }], { session });

        // Validate and create relations
        const relationsToCreate = [];
        for (const brandData of list_of_selected_brands) {
            // Validate brand exists
            const brand = await Brand.findById(brandData.brand_id).session(session);
            if (!brand) {
                await session.abortTransaction();
                return res.status(400).json({ message: `Brand ${brandData.brand_id} not found` });
            }

            // Validate pricing type
            if (!brand.available_prices.includes(brandData.pricing_type)) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    message: `Pricing type ${brandData.pricing_type} not allowed for brand ${brand.name}`
                });
            }

            relationsToCreate.push({
                party: newParty[0]._id,
                brand: brandData.brand_id,
                default_price: brandData.pricing_type,
                discount: brandData.discount
            });
        }

        // Bulk insert relations
        await PartyBrandRelationData.insertMany(relationsToCreate, { session });

        await session.commitTransaction();
        res.status(201).json(newParty[0]);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error creating party", error: error.message });
    } finally {
        session.endSession();
    }
};

// Update party
//list_of_required_relations = [{
                            // relation_id:,
                            // required: 0,1     }]
export const updateParty = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, gst_no, address, preferred_courier, list_of_selected_brands } = req.body;

        // Validate party exists
        const existingParty = await Party.findById(req.params.id).session(session);
        if (!existingParty) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Party not found" });
        }

        // Update party details
        const updatedParty = await Party.findByIdAndUpdate(
            req.params.id,
            { name, gst_no, address, preferred_courier },
            { new: true, runValidators: true, session }
        );

        // Remove existing relations
        await PartyBrandRelationData.deleteMany({ party: existingParty._id }).session(session);

        // Validate and create new relations
        const relationsToCreate = [];
        for (const brandData of list_of_selected_brands) {
            const brand = await Brand.findById(brandData.brand_id).session(session);
            if (!brand) {
                await session.abortTransaction();
                return res.status(400).json({ message: `Brand ${brandData.brand_id} not found` });
            }

            if (!brand.available_prices.includes(brandData.pricing_type)) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: `Pricing type ${brandData.pricing_type} not allowed for brand ${brand.name}`
                });
            }

            relationsToCreate.push({
                party: existingParty._id,
                brand: brandData.brand_id,
                default_price: brandData.pricing_type,
                discount: brandData.discount
            });
        }

        // Bulk insert new relations
        await PartyBrandRelationData.insertMany(relationsToCreate, { session });

        await session.commitTransaction();
        res.status(200).json(updatedParty);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error updating party", error: error.message });
    } finally {
        session.endSession();
    }
};

// Delete party
export const deleteParty = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const deletedParty = await Party.findByIdAndDelete(req.params.id).session(session);
        if (!deletedParty) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Party not found" });
        }

        await PartyBrandRelationData.deleteMany({ party: req.params.id }).session(session);
        await specialDiscountModel.deleteMany({ party_id: req.params.id }).session(session);
        await session.commitTransaction();
        
        res.status(200).json({ message: "Party deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error deleting party", error: error.message });
    } finally {
        session.endSession();
    }
};