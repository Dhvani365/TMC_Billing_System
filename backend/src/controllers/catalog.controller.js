import Catalog from '../models/catalog.model.js';
import specialDiscountModel from '../models/specialDiscount.model.js';
import skuModel from '../models/sku.model.js';

// Get all catalogs
// export const getCatalogs = async (req, res) => {
//     try {
//         const catalogs = await Catalog.find().populate('brand', 'name');
//         res.status(200).json(catalogs);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching catalogs", error: error.message });
//     }
// };

export const getCatalogsByBrand = async (req, res) => {
    try {
      const { id } = req.params;
      const catalogs = await Catalog.find({ brand: id }).populate('brand');
      if (catalogs.length === 0) {
        return res.status(201).json({ message: "No catalogs found for this brand" });
      }
      res.status(200).json(catalogs);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving catalogs", error });
    }
  };

// Get catalog by ID
export const getCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findById(req.params.id).populate('brand', 'name');
        if (!catalog) {
            return res.status(201).json({ message: "Catalog not found" });
        }
        res.status(200).json(catalog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching catalog", error: error.message });
    }
};

// Add new catalog
export const addCatalog = async (req, res) => {
    try {
        const { brand, name, no_of_skus } = req.body;

        // Check if catalog already exists for the brand
        const existingCatalog = await Catalog.findOne({ brand, name });
        if (existingCatalog) {
            // Update the no_of_skus field for the existing catalog
            existingCatalog.no_of_skus += no_of_skus;
            await existingCatalog.save();
            return res.status(200).json({ 
                _id: existingCatalog._id, 
                message: "Catalog already exists, no_of_skus updated" 
            });
        }

        const newCatalog = new Catalog({ brand, name, no_of_skus });
        const savedCatalog = await newCatalog.save();
        const populatedCatalog = await savedCatalog.populate('_id', 'brand');

        res.status(201).json(populatedCatalog);
    } catch (error) {
        res.status(500).json({ message: "Error creating catalog", error: error.message });
    }
};

// Update catalog
export const updateCatalog = async (req, res) => {
    try {
        const { brand, name, no_of_skus } = req.body;
        // Check if new name already exists for another catalog of the same brand
        const existingCatalog = await Catalog.findOne({
            _id: { $ne: req.params.id }
        });

        if (!existingCatalog) {
            return res.status(400).json({ message: "Catalog does not exist" });
        }

        const updatedCatalog = await Catalog.findByIdAndUpdate(
            req.params.id,
            { name, no_of_skus },
            { new: true, runValidators: true }
        ).populate('brand', 'name');

        return res.status(200).json(updatedCatalog);
    } catch (error) {
        return res.status(500).json({ message: "Error updating catalog", error: error.message });
    }
};

// Delete catalog
export const deleteCatalog = async (req, res) => {
    try {
        const deletedspecialDiscount = await specialDiscountModel.deleteMany({catalog_id : req.params.id});
        const deletedsku = await skuModel.deleteMany({catalog : req.params.id});
        const deletedCatalog = await Catalog.findByIdAndDelete(req.params.id);

        
        if (!deletedCatalog) {
            return res.status(404).json({ message: "Catalog not found" });
        }

        res.status(200).json({ message: "Catalog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting catalog", error: error.message });
    }
};
