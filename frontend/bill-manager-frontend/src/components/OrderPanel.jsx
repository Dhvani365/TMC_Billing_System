// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedCatalog } from "@/store/catalogSlice"; 
// import { addToBill } from "@/store/billSlice"; // Import bill action
// import { HiArrowSmallLeft } from "react-icons/hi2";
// import axios from "axios";
// import './Loader.css';

// const OrderPanel = () => {
//   const dispatch = useDispatch();
  
//   const selectedBrand = useSelector((state) => state.brand.selectedBrand);
//   const selectedCatalog = useSelector((state) => state.catalog.selectedCatalog);
//   const selectedClient = useSelector((state) => state.client.selectedClient);
//   const [catalogs, setCatalogs] = useState([]);
//   const [products, setProducts] = useState([]); // Store fetched SKUs (Products)
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedPriceType, setSelectedPriceType] = useState("");
//   const [partyPricing, setPartyPricing] = useState(null);
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [wspPrice, setWspPrice] = useState(0);
//   const [cpPrice, setCpPrice] = useState(0);
//   const [wspDiscount, setWspDiscount] = useState(0);
//   const [cpDiscount, setCpDiscount] = useState(0);
//   const [loadingCatalogs, setLoadingCatalogs] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const catalogRefs = useRef([]);
//   const productRefs = useRef([]);

//   // Fetch catalogs when the selected brand changes
//   useEffect(() => {
//     const fetchCatalogs = async () => {
//       if (selectedBrand) {
//         setLoadingCatalogs(true);
//         try {
//           const response = await axios.get(`http://localhost:3000/api/catalog/brandid/${selectedBrand._id}`);
//           setCatalogs(response.data);  
//         } catch (error) {
//           console.error("Error fetching catalogs:", error);
//           setCatalogs([]);
//         } finally {
//           setTimeout(() => setLoadingCatalogs(false), 200); // Simulate loading delay
//         }
//       } else {
//         setCatalogs([]);
//         dispatch(setSelectedCatalog(null));
//       }
//     };
//     fetchCatalogs();
//     dispatch(setSelectedCatalog(null)); // Reset selected catalog
//     setProducts([]); // Reset products
//     setSelectedProduct(null); // Reset selected product
//     setSelectedPriceType(""); // Reset selected price type
//   }, [selectedBrand, dispatch]);

//   // Reset catalogs and products when the selected client changes
//   useEffect(() => {
//     setCatalogs([]);
//     setProducts([]);
//     dispatch(setSelectedCatalog(null)); // Reset selected catalog
//     setSelectedProduct(null); // Reset selected product
//     setSelectedPriceType(""); // Reset selected price type
//   }, [selectedClient, dispatch]);

//   // Fetch products (SKUs) when selectedCatalog changes
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (selectedCatalog) {
//         setLoadingProducts(true);
//         try {
//           const response = await axios.get(`http://localhost:3000/api/sku/catalog/${selectedCatalog._id}`);
//           setProducts(response.data);
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           setProducts([]);
//         } finally {
//           setLoadingProducts(false);
//         }
//       } else {
//         setProducts([]);
//       }
//     };
//     fetchProducts();
//   }, [selectedCatalog]);

//   // Fetch party pricing and discount percentage when selectedProduct changes
//   useEffect(() => {
//     const fetchPartyPricingAndDiscount = async () => {
//       if (selectedProduct && selectedClient && selectedBrand && selectedCatalog) {
//         try {
//           const partyPricingResponse = await axios.get(`http://localhost:3000/api/partyPricingSelection/${selectedClient._id}`);
//           console.log("===>", partyPricingResponse)
//           // setPartyPricing(partyPricingResponse.data[0].default_price);

//           if (partyPricingResponse.data && partyPricingResponse.data[0]) {
//             setPartyPricing(partyPricingResponse.data[0].default_price);
//           } else {
//             setPartyPricing("Both");
//           }
//           const pricingResponse = await axios.get(`http://localhost:3000/api/pricing/${selectedBrand._id}`);
//           setWspPrice(pricingResponse.data.wsp);
//           setCpPrice(pricingResponse.data.cp);

//           const discountResponse = await axios.get(`http://localhost:3000/api/discount/${selectedClient._id}/${selectedBrand._id}/${selectedCatalog._id}`);
//           setWspDiscount(discountResponse.data.wsp_discount || 0);
//           setCpDiscount(discountResponse.data.cp_discount || 0);
//         } catch (error) {
//           console.error("Error fetching party pricing or discount:", error);
//           setPartyPricing(null);
//           setWspPrice(0);
//           setCpPrice(0);
//           setWspDiscount(0);
//           setCpDiscount(0);
//         }
//       }
//     };
//     fetchPartyPricingAndDiscount();
//   }, [selectedProduct, selectedClient, selectedBrand, selectedCatalog]);

//   const handleAddToBill = () => {
//     if (!selectedProduct) {
//       alert("Please select a product.");
//       return;
//     }

//     if(!selectedPriceType && partyPricing === "Both"){
//       alert("Please select a party pricing.");  
//       return;
//     }

//     if (partyPricing && selectedProduct.priceType === "Both" && !selectedPriceType) {
//       alert("Please select a pricing option (WSR or CP).");
//       return;
//     }

//     // Determine price based on selected price type and party pricing
//     let price = selectedProduct.price;
//     let discountPercentage = 0;
//     if (partyPricing === "Both") {
//       if (selectedPriceType === "CP") {
//         price = cpPrice; // CP Price
//         discountPercentage = cpDiscount;
//       } else if (selectedPriceType === "WSR") {
//         price = wspPrice; // WSR Price
//         discountPercentage = wspDiscount;
//       }
//     }else if(partyPricing === "CP"){
//         price = cpPrice; // CP Price
//         discountPercentage = cpDiscount;
//     }else if(partyPricing === "WSP") {
//       price = wspPrice; // WSR Price
//       discountPercentage = wspDiscount;
//     }

//     // Calculate Discounted Price
//     const discountAmount = (price * discountPercentage) / 100;
//     const discountedPrice = price - discountAmount;

//     // Generate a unique ID using product ID and timestamp
//     const uniqueId = `${selectedProduct._id}-${Date.now()}`;

//     // Prepare bill data
//     const billItem = {
//       id: uniqueId,
//       productName: selectedProduct.sku_number,
//       price: selectedProduct.price.toFixed(2),
//       priceType: partyPricing=="Both"? selectedPriceType : partyPricing,
//       discountPercentage: discountPercentage,
//       discountedPrice: discountedPrice.toFixed(2),
//       quantity: 1,
//       total: discountedPrice
//     };

//     // console.log("Bill Details: ", billItem)
//     // Dispatch to Redux
//     dispatch(addToBill(billItem));

//     // Reset Selection
//     setSelectedProduct(null);
//     setSelectedPriceType("");
//   };

//   const arrayBufferToBase64 = (buffer) => {
//     let binary = '';
//     const bytes = new Uint8Array(buffer);
//     const len = bytes.byteLength;
//     for (let i = 0; i < len; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
//   };

//   const handleCatalogKeyDown = (e, index) => {
//     if (e.key === 'Enter') {
//       dispatch(setSelectedCatalog(catalogs[index]));
//     } else if (e.key === 'Tab') {
//       e.preventDefault();
//       const nextIndex = (index + 1) % catalogs.length;
//       catalogRefs.current[nextIndex].focus();
//     }
//   };

//   const handleProductKeyDown = (e, index) => {
//     if (e.key === 'Enter') {
//       setSelectedProduct(products[index]);
//     } else if (e.key === 'Tab') {
//       e.preventDefault();
//       const nextIndex = (index + 1) % products.length;
//       productRefs.current[nextIndex].focus();
//     }
//   };

//   return (
//     <div className="w-[50%] p-4 bg-gray-100">
//       <h2 className="text-lg font-bold mb-4">Order Panel</h2>

//       {!selectedBrand && <p className="text-gray-500 italic">Please select a brand to see catalogs.</p>}

//       {selectedBrand && !selectedCatalog && (
//         <div>
//           <h3 className="text-md font-bold mb-2">Select a Catalog</h3>
//           {loadingCatalogs ? (
//             <div className="loading-container">
//               <div className="loader"></div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 gap-4">
//               {catalogs.length > 0 ? (
//                 catalogs.map((catalog, index) => (
//                   <div
//                     key={catalog._id}
//                     className="border p-3 rounded-md shadow-md cursor-pointer bg-white text-center hover:bg-gray-200"
//                     tabIndex={0}
//                     ref={(el) => (catalogRefs.current[index] = el)}
//                     onKeyDown={(e) => handleCatalogKeyDown(e, index)}
//                     onClick={() => dispatch(setSelectedCatalog(catalog))}
//                   >
//                     <h3 className="font-semibold">{catalog.name}</h3>
//                     <p className="text-sm text-gray-500">Price: ₹{catalog.price.toFixed(2)}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 italic">No catalogs available for this brand.</p>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {selectedCatalog && (
//         <div>
//           <div className="flex items-center mb-4">
//             <HiArrowSmallLeft className="text-xl text-[#123524] mr-2" />
//             <button className="text-sm text-[#123524]" onClick={() => dispatch(setSelectedCatalog(null))}>
//               Back to Catalogs
//             </button>
//           </div>

//           <h3 className="text-md font-bold mb-2">Products in {selectedCatalog.name}</h3>
//           {loadingProducts ? (
//             <div className="loading-container">
//               <div className="loader"></div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 gap-4">
//               {products.length > 0 ? (
//                 products.map((product, index) => (
//                   <div
//                     key={product._id}
//                     className={`border cursor-pointer p-2 rounded-md shadow-md bg-white text-center ${
//                       selectedProduct?._id === product._id ? "border-green-500" : ""
//                     }`}
//                     tabIndex={0}
//                     ref={(el) => (productRefs.current[index] = el)}
//                     onKeyDown={(e) => handleProductKeyDown(e, index)}
//                     onClick={() => setSelectedProduct(product)}
//                   >
//                     <img src={`data:${product.image.contentType};base64,${arrayBufferToBase64(product.image.data.data)}`} alt={product.name} className="w-full h-32 object-cover rounded-md" />
//                     <h3 className="text-sm font-bold mt-2">{product.name}</h3>
//                     <p className="text-xs text-gray-500">SKU: {product.sku_number}</p>
//                     <p className="text-sm mt-1">Price: <b>₹{product.price}</b></p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 italic">No products available in this catalog.</p>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {selectedProduct && partyPricing === "Both" && (
//         <div className="mt-4 flex items-center">
//           <label className="mr-2 font-semibold">Select Price Type:</label>
//           <select
//             value={selectedPriceType}
//             onChange={(e) => setSelectedPriceType(e.target.value)}
//             className="border p-2 rounded-md w-[20%]"
//           >
//             <option value="">Select</option>
//             <option value="WSR">WSR</option>
//             <option value="CP">CP</option>
//           </select>
//         </div> 
//       )}

//       {selectedProduct && (
//         <div className="mt-4">
//           <button 
//             onClick={handleAddToBill} 
//             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Add to Bill
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderPanel;

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCatalog } from "@/store/catalogSlice"; 
import { addToBill } from "@/store/billSlice";
import { HiArrowSmallLeft } from "react-icons/hi2";
import axios from "axios";
import './Loader.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrderPanel = () => {
  const dispatch = useDispatch();
  
  const selectedBrand = useSelector((state) => state.brand.selectedBrand);
  const selectedCatalog = useSelector((state) => state.catalog.selectedCatalog);
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const [catalogs, setCatalogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const catalogRefs = useRef([]);
  const productRefs = useRef([]);

  // Fetch catalogs when the selected brand changes
  useEffect(() => {
    const fetchCatalogs = async () => {
      if (selectedBrand) {
        setLoadingCatalogs(true);
        try {
          const response = await axios.get(`${BACKEND_URL}/catalog/brandid/${selectedBrand._id}`, {
            withCredentials: true,
          });
          setCatalogs(response.data);  
        } catch (error) {
          console.error("Error fetching catalogs:", error);
          setCatalogs([]);
        } finally {
          setTimeout(() => setLoadingCatalogs(false), 200);
        }
      } else {
        setCatalogs([]);
        dispatch(setSelectedCatalog(null));
      }
    };
    fetchCatalogs();
    dispatch(setSelectedCatalog(null));
    setProducts([]);
    setSelectedProduct(null);
  }, [selectedBrand, dispatch]);

  // Reset catalogs and products when the selected client changes
  useEffect(() => {
    setCatalogs([]);
    setProducts([]);
    dispatch(setSelectedCatalog(null));
    setSelectedProduct(null);
  }, [selectedClient, dispatch]);

  // Fetch products (SKUs) and pricing when selectedCatalog changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCatalog && selectedClient && selectedBrand) {
        setLoadingProducts(true);
        try {
          // Fetch basic SKU data
          const skuResponse = await axios.get(`${BACKEND_URL}/sku/catalog/${selectedCatalog._id}`, {
            withCredentials: true,
          });
          
          // Fetch pricing data
          const pricingResponse = await axios.get(
            `${BACKEND_URL}/pricing/party/${selectedClient._id}/brand/${selectedBrand._id}/catalog/${selectedCatalog._id}`
            , {
              withCredentials: true,
            });

          const brandResponse = await axios.get(
            `${BACKEND_URL}/brand/${selectedBrand._id}`
            , {
              withCredentials: true,
            });
          
          // Merge SKU and pricing data
          const mergedProducts = skuResponse.data.map(sku => {
            const pricingData = pricingResponse.data.find(p => p.sku_id === sku._id) || {};
            return {
              ...sku,
              price: pricingData.price || sku.price,
              basePrice: pricingData.base_price,
              discountPercentage: pricingData.discount_percentage || 0,
              discountAmount: pricingData.discount_amount || 0,
              priceType: pricingData.price_type,
              gst: brandResponse.data.gst_rate

            };
          });
          console.log(mergedProducts);
          setProducts(mergedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } finally {
          setLoadingProducts(false);
        }
      } else {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedCatalog, selectedClient, selectedBrand]);

  const handleAddToBill = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    // Generate a unique ID using product ID and timestamp
    const uniqueId = `${selectedProduct._id}-${Date.now()}`;

    // Prepare bill data
    const billItem = {
      id: uniqueId,
      productName: selectedProduct.sku_number,
      price: selectedProduct.basePrice,
      priceType: selectedProduct.priceType,
      discountPercentage: selectedProduct.discountPercentage,
      discountedPrice: selectedProduct.price,
      quantity: 1,
      total: selectedProduct.price
    };

    // Dispatch to Redux
    dispatch(addToBill(billItem));

    // Reset Selection
    setSelectedProduct(null);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleCatalogKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      dispatch(setSelectedCatalog(catalogs[index]));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextIndex = (index + 1) % catalogs.length;
      catalogRefs.current[nextIndex].focus();
    }
  };

  const handleProductKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      setSelectedProduct(products[index]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextIndex = (index + 1) % products.length;
      productRefs.current[nextIndex].focus();
    }
  };

  return (
    <div className="w-[50%] p-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4">Order Panel</h2>

      {!selectedBrand && <p className="text-gray-500 italic">Please select a brand to see catalogs.</p>}

      {selectedBrand && !selectedCatalog && (
        <div>
          <h3 className="text-md font-bold mb-2">Select a Catalog</h3>
          {loadingCatalogs ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {catalogs.length > 0 ? (
                catalogs.map((catalog, index) => (
                  <div
                    key={catalog._id}
                    className="border p-3 rounded-md shadow-md cursor-pointer bg-white text-center hover:bg-gray-200"
                    tabIndex={0}
                    ref={(el) => (catalogRefs.current[index] = el)}
                    onKeyDown={(e) => handleCatalogKeyDown(e, index)}
                    onClick={() => dispatch(setSelectedCatalog(catalog))}
                  >
                    <h3 className="font-semibold">{catalog.name}</h3>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No catalogs available for this brand.</p>
              )}
            </div>
          )}
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
          {loadingProducts ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div
                    key={product._id}
                    className={`border cursor-pointer p-2 rounded-md shadow-md bg-white text-center ${
                      selectedProduct?._id === product._id ? "border-green-500" : ""
                    }`}
                    tabIndex={0}
                    ref={(el) => (productRefs.current[index] = el)}
                    onKeyDown={(e) => handleProductKeyDown(e, index)}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img src={`data:${product.image.contentType};base64,${arrayBufferToBase64(product.image.data.data)}`} alt={product.name} className="w-full h-32 object-cover rounded-md" />
                    <h3 className="text-sm font-bold mt-2">{product.name}</h3>
                    <p className="text-xs text-gray-500">SKU: {product.sku_number}</p>
                    <p className="text-sm mt-1">Price: <b>₹{product.price}</b></p>
                    {/* <p className="text-xs text-gray-500">({product.priceType})</p>
                    <p className="text-xs text-gray-500">Discount: {product.discountPercentage}%</p> */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No products available in this catalog.</p>
              )}
            </div>
          )}
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
  );
};

export default OrderPanel;
