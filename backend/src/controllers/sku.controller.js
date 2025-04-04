import SKU from '../models/sku.model.js';
import sharp from 'sharp';

// Update SKU Image
export const updateSKUImage = async (req, res) => {
    try {
        const { id } = req.params;
        let outputFormat = 'jpeg'; // Default to JPEG
        let outputOptions = { quality: 80 };

        if (req.file.mimetype === 'image/png') {
            outputFormat = 'png';
            outputOptions = { compressionLevel: 8 }; // PNG compression (0-9)
        } 
        else if (req.file.mimetype === 'image/webp') {
            outputFormat = 'webp';
            outputOptions = { quality: 80 };
        }

        const compressedImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 800, withoutEnlargement: true }) // Resize to lower resolution, don't enlarge small images
            [outputFormat](outputOptions) // Use determined format and options
            .toBuffer();
            
        const image = {
            data: compressedImageBuffer,
            contentType: `image/${outputFormat}`,
        }

        const updatedSKU = await SKU.findByIdAndUpdate(
            id,
            { image },
            { new: true, runValidators: true }
        )
            .populate('brand', 'name')
            .populate('catalog', 'name');

        if (!updatedSKU) {
            return res.status(404).json({ message: "SKU not found" });
        }

        res.status(200).json({ message: "SKU updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating SKU image", error: error.message });
    }
};

// Get all SKUs
// export const getSKUs = async (req, res) => {
//     try {
//         const skus = await SKU.find()
//             .populate('brand', 'name')
//             .populate('catalog', 'name');
//         res.status(200).json(skus);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching SKUs", error: error.message });
//     }
// };

export const getSKUsByCatalog = async (req, res) => {
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

        // Convert binary image data to base64-encoded string
        const skusWithBase64Images = skus.map(sku => {
            if (sku.image && sku.image.data) {
                const base64Image = sku.image.data.toString('base64');
                return {
                    ...sku.toObject(),
                    image: {
                        ...sku.image,
                        data: `data:${sku.image.contentType};base64,${base64Image}`
                    }
                };
            }
            return sku;
        });
        
        res.status(200).json(skusWithBase64Images);
    } catch (error) {
        res.status(500).json({ message: "Error fetching SKU", error: error.message });
    }
};

// Add new SKU
export const addSKU = async (req, res) => {
    try {
        const { brand, catalog, sku_number, price } = req.body;

        let outputFormat = 'jpeg'; // Default to JPEG
        let outputOptions = { quality: 80 };

        if (req.file.mimetype === 'image/png') {
            outputFormat = 'png';
            outputOptions = { compressionLevel: 8 }; // PNG compression (0-9)
        } 
        else if (req.file.mimetype === 'image/webp') {
            outputFormat = 'webp';
            outputOptions = { quality: 80 };
        }

        const compressedImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 800, withoutEnlargement: true }) // Resize to lower resolution, don't enlarge small images
            [outputFormat](outputOptions) // Use determined format and options
            .toBuffer();
            
        const image = {
            data: compressedImageBuffer,
            contentType: `image/${outputFormat}`,
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