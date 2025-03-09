import SKU from '../models/sku.model.js';

// Get all SKUs
export const getSKUs = async (req, res) => {
    try {
        const skus = await SKU.find()
            .populate('brand', 'name')
            .populate('catalog', 'name');
        res.status(200).json(skus);
    } catch (error) {
        res.status(500).json({ message: "Error fetching SKUs", error: error.message });
    }
};

export const getSKUsByBrandAndCatalog = async (req, res) => {
    try {
      const { catalogId } = req.params;
  
      // Fetch SKUs for the given brand and catalog
      const skus = await SKU.find({ catalog: catalogId });
  
      res.status(200).json(skus);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving SKUs", error });
    }
  };
  
// Get SKU by ID
export const getSKUById = async (req, res) => {
    try {
        const sku = await SKU.findById(req.params.id)
            .populate('brand', 'name')
            .populate('catalog', 'name');
            
        if (!sku) {
            return res.status(404).json({ message: "SKU not found" });
        }
        
        res.status(200).json(sku);
    } catch (error) {
        res.status(500).json({ message: "Error fetching SKU", error: error.message });
    }
};

// Add new SKU
export const addSKU = async (req, res) => {
    try {
        const { brand, catalog, sku_number, price } = req.body;
        const image = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        }

        // Check if SKU number already exists
        const existingSKU = await SKU.findOne({ sku_number });
        if (existingSKU) {
            return res.status(400).json({ message: "SKU number already exists" });
        }

        const newSKU = new SKU({
            brand,
            catalog,
            sku_number,
            price,
            image
        });

        const savedSKU = await newSKU.save();
        const populatedSKU = await savedSKU
            .populate('brand', 'name')
            .populate('catalog', 'name');

        res.status(201).json(populatedSKU);
    } catch (error) {
        res.status(500).json({ message: "Error creating SKU", error: error.message });
    }
};

// Update SKU
export const updateSKU = async (req, res) => {
    try {
        const { brand, catalog, sku_number, price } = req.body;

        // Check if new SKU number already exists for another SKU
        const existingSKU = await SKU.findOne({
            sku_number,
            _id: { $ne: req.params.id }
        });

        if (existingSKU) {
            return res.status(400).json({ message: "SKU number already exists" });
        }

        const updatedSKU = await SKU.findByIdAndUpdate(
            req.params.id,
            { brand, catalog, sku_number, price },
            { new: true, runValidators: true }
        )
            .populate('brand', 'name')
            .populate('catalog', 'name');

        if (!updatedSKU) {
            return res.status(404).json({ message: "SKU not found" });
        }

        res.status(200).json(updatedSKU);
    } catch (error) {
        res.status(500).json({ message: "Error updating SKU", error: error.message });
    }
};

// Delete SKU
export const deleteSKU = async (req, res) => {
    try {
        const deletedSKU = await SKU.findByIdAndDelete(req.params.id);
        
        if (!deletedSKU) {
            return res.status(404).json({ message: "SKU not found" });
        }

        res.status(200).json({ message: "SKU deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting SKU", error: error.message });
    }
};