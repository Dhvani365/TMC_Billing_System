import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCatalog } from "@/store/catalogSlice"; 
import { addToBill } from "@/store/billSlice"; // Import bill action
import { HiArrowSmallLeft } from "react-icons/hi2";
import axios from "axios";

const OrderPanel = () => {
  const dispatch = useDispatch();
  
  const selectedBrand = useSelector((state) => state.brand.selectedBrand);
  const selectedCatalog = useSelector((state) => state.catalog.selectedCatalog);
  const selectedParty = useSelector((state) => state.client.selectedClient);
  const [catalogs, setCatalogs] = useState([]);
  const [products, setProducts] = useState([]); // Store fetched SKUs (Products)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [partyPricing, setPartyPricing] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [wspPrice, setWspPrice] = useState(0);
  const [cpPrice, setCpPrice] = useState(0);
  const [wspDiscount, setWspDiscount] = useState(0);
  const [cpDiscount, setCpDiscount] = useState(0);

  // Fetch catalogs when the selected brand changes
  useEffect(() => {
    const fetchCatalogs = async () => {
      if (selectedBrand) {
        try {
          const response = await axios.get(`http://localhost:3000/api/catalog/brandid/${selectedBrand._id}`);
          console.log(response.data);  
          setCatalogs(response.data);  
        } catch (error) {
          console.error("Error fetching catalogs:", error);
          setCatalogs([]);
        }
      } else {
        setCatalogs([]);
        dispatch(setSelectedCatalog(null));
      }
    };
    fetchCatalogs();
    dispatch(setSelectedCatalog(null)); // Reset selected catalog
    setProducts([]); // Reset products
    setSelectedProduct(null); // Reset selected product
    setSelectedPriceType(""); // Reset selected price type
  }, [selectedBrand, dispatch]);

  // Fetch products (SKUs) when selectedCatalog changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCatalog) {
        try {
          const response = await axios.get(`http://localhost:3000/api/sku/catalog/${selectedCatalog._id}`);
          console.log(response.data);
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedCatalog]);

  // Fetch party pricing and discount percentage when selectedProduct changes
  useEffect(() => {
    const fetchPartyPricingAndDiscount = async () => {
      if (selectedProduct && selectedParty && selectedBrand && selectedCatalog) {
        try {
          const partyPricingResponse = await axios.get(`http://localhost:3000/api/partyPricingSelection/${selectedParty._id}`);
          console.log("Pricing Details: ", partyPricingResponse.data[0].default_price);
          setPartyPricing(partyPricingResponse.data[0].default_price);

          const pricingResponse = await axios.get(`http://localhost:3000/api/pricing/${selectedBrand._id}`);
          console.log("pricingResponse Details: ", pricingResponse.data);
          setWspPrice(pricingResponse.data.wsp);
          setCpPrice(pricingResponse.data.cp);

          const discountResponse = await axios.get(`http://localhost:3000/api/discount/${selectedParty._id}/${selectedBrand._id}/${selectedCatalog._id}`);
          console.log("Discount Details: ", discountResponse.data);
          setWspDiscount(discountResponse.data.wsp_discount || 0);
          setCpDiscount(discountResponse.data.cp_discount || 0);
        } catch (error) {
          console.error("Error fetching party pricing or discount:", error);
          setPartyPricing(null);
          setWspPrice(0);
          setCpPrice(0);
          setWspDiscount(0);
          setCpDiscount(0);
        }
      }
    };
    fetchPartyPricingAndDiscount();
  }, [selectedProduct, selectedParty, selectedBrand, selectedCatalog]);

  const handleAddToBill = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (partyPricing && selectedProduct.priceType === "Both" && !selectedPriceType) {
      alert("Please select a pricing option (WSR or CP).");
      return;
    }

    // Determine price based on selected price type and party pricing
    let price = selectedProduct.price;
    let discountPercentage = 0;
    if (partyPricing === "Both") {
      if (selectedPriceType === "CP") {
        price = cpPrice; // CP Price
        discountPercentage = cpDiscount;
      } else if (selectedPriceType === "WSR") {
        price = wspPrice; // WSR Price
        discountPercentage = wspDiscount;
      }
    }else if(partyPricing === "CP"){
        price = cpPrice; // CP Price
        discountPercentage = cpDiscount;
    }else if(partyPricing === "WSP") {
      price = wspPrice; // WSR Price
      discountPercentage = wspDiscount;
    }

    // Calculate Discounted Price
    const discountAmount = (price * discountPercentage) / 100;
    const discountedPrice = price - discountAmount;

    // Prepare bill data
    const billItem = {
      productName: selectedProduct.sku_number,
      price: price.toFixed(2),
      priceType: partyPricing=="Both"? selectedPriceType : partyPricing,
      discountPercentage: discountPercentage,
      discountedPrice: discountedPrice.toFixed(2),
      // total: discountedPrice.toFixed(2),
    };

    console.log("Bill Details: ", billItem)
    // Dispatch to Redux
    dispatch(addToBill(billItem));

    // Reset Selection
    setSelectedProduct(null);
    setSelectedPriceType("");
  };

  return (
    <div className="w-[80%] p-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4">Order Panel</h2>

      {!selectedBrand && <p className="text-gray-500 italic">Please select a brand to see catalogs.</p>}

      {selectedBrand && !selectedCatalog && (
        <div>
          <h3 className="text-md font-bold mb-2">Select a Catalog</h3>
          <div className="grid grid-cols-4 gap-4">
            {catalogs.length > 0 ? (
              catalogs.map((catalog) => (
                <div
                  key={catalog._id}
                  className="border p-3 rounded-md shadow-md cursor-pointer bg-white text-center hover:bg-gray-200"
                  onClick={() => dispatch(setSelectedCatalog(catalog))}
                >
                  <h3 className="font-semibold">{catalog.name}</h3>
                  <p className="text-sm text-gray-500">Price: ₹{catalog.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No catalogs available for this brand.</p>
            )}
          </div>
        </div>
      )}

      {selectedCatalog && (
        <div>
          <div className="flex items-center mb-4">
            <HiArrowSmallLeft className="text-xl text-[#123524] mr-2" />
            <button className="text-sm text-[#123524]" onClick={() => dispatch(setSelectedCatalog(null))}>
              Back to Catalogs
            </button>
          </div>

          <h3 className="text-md font-bold mb-2">Products in {selectedCatalog.name}</h3>
          <div className="grid grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className={`border cursor-pointer p-2 rounded-md shadow-md bg-white text-center ${
                    selectedProduct?.id === product.id ? "border-green-500" : ""
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md" />
                  <h3 className="text-sm font-bold mt-2">{product.name}</h3>
                  <p className="text-xs text-gray-500">SKU: {product.sku_number}</p>
                  <p className="text-sm mt-1">Price: <b>₹{product.price}</b></p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No products available in this catalog.</p>
            )}
          </div>

          {selectedProduct && partyPricing === "Both" && (
            <div className="mt-4 flex items-center">
              <label className="mr-2 font-semibold">Select Price Type:</label>
              <select
                value={selectedPriceType}
                onChange={(e) => setSelectedPriceType(e.target.value)}
                className="border p-2 rounded-md w-[20%]"
              >
                <option value="">Select</option>
                <option value="WSR">WSR</option>
                <option value="CP">CP</option>
              </select>
            </div> 
          )}

          {selectedProduct && (
            <div className="mt-4">
              <button 
                onClick={handleAddToBill} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add to Bill
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderPanel;