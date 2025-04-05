import Party from '../models/party.model.js';
import Brand from '../models/brand.model.js';
import mongoose from 'mongoose'; // Import mongoose to generate ObjectIds

export const replaceBrandNamesWithIds = async (req, res) => {
  try {
    // Step 1: Fetch all brands and create a mapping of brand names to IDs
    const brands = await Brand.find();
    const brandNameToIdMap = {};
    brands.forEach((brand) => {
      brandNameToIdMap[brand.name] = brand._id;
    });

    // Step 2: Fetch all parties
    const parties = await Party.find();

    // Step 3: Update each party's selected_brands field
    for (const party of parties) {
      const updatedSelectedBrands = party.selected_brands.map((brandName) => {
        let brandId = brandNameToIdMap[brandName];
        if (!brandId) {
          console.warn(`Brand name "${brandName}" not found in the database. Generating a random ID.`);
          brandId = new mongoose.Types.ObjectId(); // Generate a random ObjectId
        }
        return brandId;
      });

      // Step 4: Save the updated party
      party.selected_brands = updatedSelectedBrands;
      await party.save();
    }

    res.status(200).json({ message: "Successfully replaced brand names with IDs in all parties." });
  } catch (error) {
    console.error("Error replacing brand names with IDs:", error);
    res.status(500).json({ message: "Error replacing brand names with IDs", error: error.message });
  }
};