import Party from '../models/party.model.js';
import PartyBrandRelationData from '../models/partyBrandSelection.model.js';

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
        const party = await Party.findOne(req.params.id)
        const Relations = await PartyBrandRelationData.find({party:req.params.id})
        res.status(200).json({party: party,
                              reletions: Relations});
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
    try {
        const { name, gst_no, address, preferred_courier, list_of_selected_brands } = req.body;

        const existingParty = await Party.findOne({ gst_no });
        if (existingParty) {
            return res.status(400).json({ message: "Party with this GST number already exists" });
        }

        const newParty = new Party({
            name,
            gst_no,
            address,
            preferred_courier,
        });

        const savedParty = await newParty.save();
        for(let i = 0; i < list_of_selected_brands.length; i++)
        {
            var newRelation = new PartyBrandRelationData({
                party: savedParty._id,
                brand: list_of_selected_brands[i].brand_id,
                default_price: list_of_selected_brands[i].pricing_type,
                discount: list_of_selected_brands[i].discount
            });
            await newRelation.save()
        }
        

        res.status(201).json(newParty);
    } catch (error) {
        res.status(500).json({ message: "Error creating party", error: error.message });
    }
};

// Update party
//list_of_required_relations = [{
                            // relation_id:,
                            // required: 0,1     }]
export const updateParty = async (req, res) => {
    try {
        const { name, gst_no, address, preferred_courier, list_of_selected_brands} = req.body;

        const existingParty = await Party.findOne({
            _id: { $ne: req.params.id }
        });

        if (!existingParty) {
            return res.status(400).json({ message: "Party not found" });
        }

        const updatedParty = await Party.findByIdAndUpdate(
            req.params.id,
            {
                name,
                gst_no,
                address,
                preferred_courier,
            },
            { new: true, runValidators: true }
        );
        await PartyBrandRelationData.deleteMany({party : existingParty._id})
        for(let i = 0; i < list_of_selected_brands.length; i++)
            {
                var newRelation = new PartyBrandRelationData({
                    party: existingParty._id,
                    brand: list_of_selected_brands[i].brand_id,
                    default_price: list_of_selected_brands[i].pricing_type,
                    discount: list_of_selected_brands[i].discount
                });
                await newRelation.save()
            }
        if (!updatedParty) {
            return res.status(404).json({ message: "Party not found" });
        }

        res.status(200).json(updatedParty);
    } catch (error) {
        res.status(500).json({ message: "Error updating party", error: error.message });
    }
};

// Delete party
export const deleteParty = async (req, res) => {
    try {
        const deletedParty = await Party.findByIdAndDelete(req.params.id);
        await PartyBrandRelationData.deleteMany({ party: req.params.id })
        if (!deletedParty) {
            return res.status(404).json({ message: "Party not found" });
        }

        res.status(200).json({ message: "Party deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting party", error: error.message });
    }
};