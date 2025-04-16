import SKU from '../models/sku.model.js';
import sharp from 'sharp';
import mongoose from 'mongoose';

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

export const addSKU = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
  
      // Proceed with processing the request body
      const { brand, catalog } = req.body;
  
      // Parse SKUs from the request body
        const { skus } = req.body;

        if (!Array.isArray(skus)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid SKUs format" });
        }

        // Attach images to the corresponding SKUs if files exist
        skus.forEach((sku, index) => {
            const file = req.files.find((file) => file.fieldname === `skus[${index}][image]`);
            if (file) {
                sku.image = {
                data: file.buffer,
                contentType: file.mimetype,
                };
            }
        });
  
      // Attach images to the corresponding SKUs if files exist
      req.files.forEach((file) => {
        const match = file.fieldname.match(/^skus\[(\d+)\]\[image\]$/);
        if (match) {
          const index = parseInt(match[1], 10);
          skus[index].image = {
            data: file.buffer,
            contentType: file.mimetype,
          };
        }
      });
  
      // Validate and save each SKU
      for (const sku of skus) {
        if (!sku.sku_number) {
          await session.abortTransaction();
          return res.status(400).json({ message: "Missing required fields for SKU" });
        }
  
        const newSKU = new SKU({
          brand,
          catalog,
          sku_number: sku.sku_number,
          wsr_price: sku.wsr_price,
          cp_price: sku.cp_price,
          image: sku.image || { data: null, contentType: null },
        });
  
        await newSKU.save({ session });
      }
  
      await session.commitTransaction();
      res.status(201).json({ message: "SKUs added successfully" });
    } catch (error) {
        console.error("Error saving SKU:", error.message);
        await session.abortTransaction();
        return res.status(400).json({ message: "Error saving SKU", error: error.message });
    } finally {
      session.endSession();
    }
  };

// Update SKU
export const updateSKU = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let { brand, catalog, sku_number, cp_price, wsr_price } = req.body;
        // Check if new SKU number already exists for another SKU
        const existingSKU = await SKU.findOne({
            _id: { $ne: req.params.id },
            sku_number,
            brand,
            catalog,
        }).session(session);

        if (existingSKU) {
            await session.abortTransaction();
            return res.status(400).json({ message: "SKU number already exists for this brand and catalog" });
        }

        // Update the SKU
        if(typeof cp_price === 'object' || typeof cp_price !== 'string') {
            cp_price = cp_price['$numberDecimal'].toString(); // Convert to string if not already
        }
        if(typeof wsr_price !== 'string' || typeof wsr_price === 'object') {
            wsr_price = wsr_price['$numberDecimal'].toString(); // Convert to string if not already
        }
        const updatedSKU = await SKU.findByIdAndUpdate(
            req.params.id,
            {
                brand,
                catalog,
                sku_number,
                cp_price: mongoose.Types.Decimal128.fromString(cp_price), // Save as Decimal128
                wsr_price: mongoose.Types.Decimal128.fromString(wsr_price), // Save as Decimal128
            },
            { new: true, runValidators: true, session }
        )
            .populate('brand', 'name')
            .populate('catalog', 'name');

        if (!updatedSKU) {
            await session.abortTransaction();
            return res.status(404).json({ message: "SKU not found" });
        }

        await session.commitTransaction();
        res.status(200).json(updatedSKU);
    } catch (error) {
        await session.abortTransaction();
        console.error("Error updating SKU:", error.message);
        res.status(500).json({ message: "Error updating SKU", error: error.message });
    } finally {
        session.endSession();
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