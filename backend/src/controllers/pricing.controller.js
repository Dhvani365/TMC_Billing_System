import SKU from "../models/sku.model.js"; // Match the export name
import SpecialDiscount from "../models/specialDiscount.model.js";

// Get all pricing entries
export const getPricing = async (req, res) => {
const { party_id, brand_id, catalog_id, sku_id } = req.params;

try {
    // Get the SKU
    const sku = await SKU.findById(sku_id);
    if (!sku) {
    return res.status(404).json({ message: "SKU not found" });
    }

    // Get party-brand relationship to determine price type
    const partyBrand = await PartyBrandRelationData.findOne({
    party: party_id,
    brand: brand_id
    });

    if (!partyBrand) {
    return res.status(404).json({ message: "Party-brand relationship not found" });
    }

    // Check for active special discount
    const specialDiscount = await SpecialDiscount.findOne({
    party_id,
    brand_id,
    catalog_id,
    status: true
    });

    // Determine price type and discount
    let priceType = partyBrand.default_price;
    let discount = partyBrand.discount;

    if (specialDiscount) {
    priceType = specialDiscount.price_type;
    discount = specialDiscount.discount;
    }

    // Get the appropriate price based on price type
    let basePrice;
    if (priceType === "WSR") {
    basePrice = sku.wsr_price;
    } else if (priceType === "CP") {
    basePrice = sku.cp_price;
    }

    if (!basePrice) {
    return res.status(400).json({ message: `${priceType} price not available for this SKU` });
    }

    // Convert Decimal128 to number for calculations
    const basePriceValue = parseFloat(basePrice.toString());
    
    // Calculate final price with discount
    const discountAmount = basePriceValue * (discount / 100);
    const finalPrice = basePriceValue - discountAmount;

    res.status(200).json({
    sku_id: sku._id,
    sku_number: sku.sku_number,
    price: finalPrice.toFixed(2),
    base_price: basePriceValue.toFixed(2),
    discount_percentage: discount,
    discount_amount: discountAmount.toFixed(2),
    price_type: priceType
    });
} catch (error) {
    res.status(500).json({ message: "Error calculating pricing", error: error.message });
}
};

// Get pricing by brand
// export const getPricingByBrand = async (req, res) => {
//     try {
//         const pricing = await Pricing.findOne({ brand: req.params.brand_id })
//             .populate('brand', 'name');
            
//         if (!pricing) {
//             return res.status(404).json({ message: "Pricing not found for this brand" });
//         }
        
//         res.status(200).json(pricing);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching pricing", error: error.message });
//     }
// };

// // Add new pricing
// export const addPricing = async (req, res) => {
//     try {
//         const { brand, wsp, cp } = req.body;

//         // Check if pricing already exists for this brand
//         const existingPricing = await Pricing.findOne({ brand });
//         if (existingPricing) {
//             return res.status(400).json({ message: "Pricing already exists for this brand" });
//         }

//         const newPricing = new Pricing({ brand, wsp, cp });
//         const savedPricing = await newPricing.save();
//         const populatedPricing = await savedPricing.populate('brand', 'name');

//         res.status(201).json(populatedPricing);
//     } catch (error) {
//         res.status(500).json({ message: "Error creating pricing", error: error.message });
//     }
// };

// // Update pricing
// export const updatePricing = async (req, res) => {
//     try {
//         const { wsp, cp } = req.body;

//         const updatedPricing = await Pricing.findOneAndUpdate(
//             { brand: req.params.brand_id },
//             { wsp, cp },
//             { new: true, runValidators: true }
//         ).populate('brand', 'name');

//         if (!updatedPricing) {
//             return res.status(404).json({ message: "Pricing not found" });
//         }

//         res.status(200).json(updatedPricing);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating pricing", error: error.message });
//     }
// };

// // Delete pricing
// export const deletePricing = async (req, res) => {
//     try {
//         const deletedPricing = await Pricing.findOneAndDelete({ brand: req.params.brand_id });
        
//         if (!deletedPricing) {
//             return res.status(404).json({ message: "Pricing not found" });
//         }

//         res.status(200).json({ message: "Pricing deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting pricing", error: error.message });
//     }
// };

export const getAllSKUPricingForBill = async (req, res) => {
    const { party_id, brand_id, catalog_id } = req.params;
  
    try {
      // Get all SKUs for the catalog
      const skus = await SKU.find({ catalog: catalog_id });
      if (skus.length === 0) {
        return res.status(404).json({ message: "No SKUs found for this catalog" });
      }
  
      // Get party-brand relationship to determine price type
      const partyBrand = await PartyBrandRelationData.findOne({
        party: party_id,
        brand: brand_id
      });
  
      if (!partyBrand) {
        return res.status(404).json({ message: "Party-brand relationship not found" });
      }
  
      // Check for active special discount
      const specialDiscount = await SpecialDiscount.findOne({
        party_id,
        brand_id,
        catalog_id,
        status: true
      });
  
      // Determine price type and discount
      let priceType = partyBrand.default_price;
      let discount = partyBrand.discount;
  
      if (specialDiscount) {
        priceType = specialDiscount.price_type;
        discount = specialDiscount.discount;
      }
  
      // Calculate pricing for each SKU
      const skuPricing = skus.map(sku => {
        let basePrice;
        if (priceType === "WSR") {
          basePrice = sku.wsr_price;
        } else if (priceType === "CP") {
          basePrice = sku.cp_price;
        }
  
        if (!basePrice) {
          return {
            sku_id: sku._id,
            sku_number: sku.sku_number,
            error: `${priceType} price not available for this SKU`
          };
        }
  
        // Convert Decimal128 to number for calculations
        const basePriceValue = parseFloat(basePrice.toString());
        
        // Calculate final price with discount
        const discountAmount = basePriceValue * (discount / 100);
        const finalPrice = basePriceValue - discountAmount;
  
        return {
          sku_id: sku._id,
          sku_number: sku.sku_number,
          price: finalPrice.toFixed(2),
          base_price: basePriceValue.toFixed(2),
          discount_percentage: discount,
          discount_amount: discountAmount.toFixed(2),
          price_type: priceType
        };
      });
  
      res.status(200).json(skuPricing);
    } catch (error) {
      res.status(500).json({ message: "Error calculating bulk pricing", error: error.message });
    }
  };