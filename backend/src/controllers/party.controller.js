import Party from '../models/party.model.js';
import Brand from "../models/brand.model.js"; // Import the Brand model
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
        // Fetch the party by ID
        const party = await Party.findById(req.params.id);
        if (!party) {
            return res.status(404).json({ message: "Party not found" });
        }

        // Fetch the relations and populate the brand details
        const relations = await PartyBrandRelationData.find({ party: req.params.id })
            .populate('brand'); // Populate all fields of the Brand model

        // Map the relations to include full brand details
        const mappedRelations = relations.map(rel => ({
            id: rel._id,
            brand: rel.brand, // Includes all fields of the Brand model
            default_price: rel.default_price,
            discount: rel.discount,
        }));    

        // Return the party and its associated brands
        res.status(200).json({
            party,
            relations: mappedRelations,
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

        // Update existing relations
        for (const brandData of list_of_selected_brands) {
            const relation = await PartyBrandRelationData.findOne({
                _id: brandData.relation_id, // Find by relation_id
                party: req.params.id, // Ensure it belongs to the correct party
                brand: brandData.brand_id, // Ensure it matches the correct brand
            }).session(session);

            if (!relation) {
                await session.abortTransaction();
                return res.status(400).json({ message: `Relation ${brandData.relation_id} not found for party ${req.params.id} and brand ${brandData.brand_id}` });
            }

            // Update the relation fields
            relation.default_price = brandData.pricing_type;
            relation.discount = brandData.discount;
            await relation.save({ session });
        }

        await session.commitTransaction();
        res.status(200).json(updatedParty);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error updating party", error: error.message });
    } finally {
        session.endSession();
    }
};

export const assignBrandToParty = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { partyId, brandId, pricing_type, discount } = req.body;

        // Validate party exists
        const party = await Party.findById(partyId).session(session);
        if (!party) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Party not found" });
        }

        // Validate brand exists
        const brand = await Brand.findById(brandId).session(session);
        if (!brand) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Brand not found" });
        }

        // Check if the brand is already assigned to the party
        const existingRelation = await PartyBrandRelationData.findOne({
            party: partyId,
            brand: brandId,
        }).session(session);

        if (existingRelation) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Brand is already assigned to this party" });
        }

        // Validate pricing type
        if (!brand.available_prices.includes(pricing_type)) {
            await session.abortTransaction();
            return res.status(400).json({
                message: `Pricing type ${pricing_type} is not allowed for brand ${brand.name}`,
            });
        }

        // Create the new brand relation
        const newRelation = await PartyBrandRelationData.create(
            [{
                party: partyId,
                brand: brandId,
                default_price: pricing_type,
                discount: discount || 0, // Default discount to 0 if not provided
            }],
            { session }
        );

        await session.commitTransaction();
        res.status(201).json({ message: "Brand assigned to party successfully", relation: newRelation[0] });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error assigning brand to party", error: error.message });
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