import React, { useState, useEffect } from "react";
import axios from "axios";
import CatalogSearch from "./left-panel-components/CatalogSearch";
import ProductSearch from "./left-panel-components/ProductSearch";
import PartySearch from "./left-panel-components/PartySearch";
import PricingSelector from "./bill/PricingSelector";
import QuantityInput from "./bill/QuantityInput";
import BillArea from "./bill/BillArea";
import BillManager from "./bill/BillManager";

const BillSystem = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [productsData, setProductsData] = useState({});
  const [parties, setParties] = useState([]);
  const [catalog, setCatalog] = useState("");
  const [product, setProduct] = useState(null);
  const [party, setParty] = useState("");
  const [pricingType, setPricingType] = useState("Normal");
  const [quantity, setQuantity] = useState(1);
  const [bill, setBill] = useState([]);
  const [savedBills, setSavedBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch catalogs
  useEffect(() => {
    axios.post("http://localhost:3000/api/getCatalog")
      .then(response => setCatalogs(response.data))
      .catch(error => console.error("Error fetching catalogs:", error));
  }, []);

  // Fetch products
  useEffect(() => {
    axios.post("http://localhost:3000/api/getProduct")
      .then(response => setProductsData(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // Fetch parties
  useEffect(() => {
    axios.post("http://localhost:3000/api/getParties")
      .then(response => {
        console.log("Fetched Parties: ", response.data); // Debugging log
        if (Array.isArray(response.data)) {
          setParties(response.data);
        } else {
          console.error("Unexpected response format for parties:", response.data);
          setParties([]); // Ensure parties is always an array
        }
      })
      .catch(error => {
        console.error("Error fetching parties:", error);
        setParties([]); // Set to empty array in case of error
      });
  }, []);

  // Get products based on selected catalog
  const products = catalog ? productsData[catalog.catalog_id] || [] : [];

  const addProductToBill = () => {
    if (!catalog || !product || !party || quantity <= 0) {
      alert("Please fill all fields before adding the product.");
      return;
    }
    
    let discount, discount_perc, price;
    if(pricingType === "Wholesale"){
      discount_perc = 10;
      price = product.wholesale_price!==null ? product.wholesale_price : 10000;
      discount = (price * 10)/100;
    }else{
      discount_perc = 10;
      price = product.selling_price!==null ? product.selling_price : 12300;
      discount = (price * 10) / 100;
    }
    const totalPrice = (price - discount) * quantity;
    setBill((prevBill) => [
      ...prevBill,
      {
        product: product.product_name,
        party,
        pricingType,
        price,
        discount_perc,
        discount: discount.toFixed(2),
        quantity,
        total: totalPrice.toFixed(2),
      },
    ]);
  };

  const handleCatalogSelect = (selectedCatalog) => {
    setCatalog(selectedCatalog);
    setProduct(null);
    setParty("");
  };

  const handleProductSelect = (selectedProduct) => {
    setProduct(selectedProduct);
    setParty("");
  };

  const handlePartySelect = (selectedParty) => {
    setParty(selectedParty);
  };

  const handleRemoveItem = (index) => {
    setBill((prevBill) => prevBill.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setBill([]);
    setCatalog("");
    setProduct(null);
    setParty("");
    setPricingType("Normal");
    setQuantity(1);
  };

  const handleSaveBill = (currentBill) => {
    const newBill = { items: currentBill, date: new Date().toISOString() };
    setSavedBills([...savedBills, newBill]);
    handleReset();
  };

  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setBill(bill.items);
  };

  return (
    <div className="flex-grow h-full bg-zinc-700 text-[#FDFFFC] flex">
      {/* Left Section: Selection Area */}
      <div className="w-2/5 p-6 border-r-2 border-[#F6AE2D] grid grid-cols-2 grid-rows-2 gap-4">
        {/* Catalog Selection */}
        <div className="bg-black p-3 rounded-lg flex flex-col">
          <div className="flex items-center border-b-2 border-[#F6AE2D] pb-1 mb-2">
        <img
            src="src/Logo/Catalog.png"
            alt="Catalog Logo"
            className="w-8 h-8 mr-2"
          />
          <h3 className="text-xl text-white font-bold">Catalogs</h3>
          </div>
          <CatalogSearch
            options={catalogs}
            onSelect={handleCatalogSelect}
            onClear={() => handleCatalogSelect("")}
            selectedValue={catalog}
          />
        </div>


        {/* Party Selection */}
        <div className="bg-black p-3 rounded-md flex flex-col">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-1 mb-2">
        <img
            src="src/Logo/Party.png"
            alt="Party Logo"
            className="w-8 h-8 mr-2"
          />
          <h3 className="text-xl text-white font-bold">Party</h3>
          </div>
          {product ? (
            <PartySearch
              parties={parties}
              onSelect={handlePartySelect}
              onClear={() => handlePartySelect("")}
              selectedValue={party}
            />
          ) : ( 
           <p className="text-center text-[#F6AE2D] text-xl">Select a product first</p>
          )}
        </div>

        {/* Product Selection */}
        <div className="bg-black p-3 rounded-md flex flex-col">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-1 mb-2">
        <img
            src="src/Logo/Product.png"
            alt="Product Logo"
            className="w-8 h-8 mr-2 bg-white rounded-full"
          />
          <h3 className="text-xl text-white font-bold">Products</h3>
          </div>
          {catalog ? (
            <ProductSearch
              options={products.map((p) => p.product_name)}
              onSelect={(selectedProduct) =>{
                handleProductSelect(products.find((p) => p.product_name === selectedProduct))
              }

              }
              onClear={() => handleProductSelect(null)}
              selectedValue={product ? product.name : ""}
            />
          ) : (
            <p className="text-center text-[#F6AE2D] text-xl">Select a catalog first</p>
          )}
        </div>

        {/* Pricing and Quantity Selection */}
        <div className="bg-black p-3 rounded-md flex flex-col">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-1 mb-2">
        <img
            src="src/Logo/Sale.png"
            alt="Sale Logo"
            className="w-8 h-8 mr-2 bg-white rounded-full"
          />
          <h3 className="text-xl text-white font-bold">Pricing</h3>
          </div>
          {party ? (
            <>
              <PricingSelector pricingType={pricingType} setPricingType={setPricingType} />
              <QuantityInput quantity={quantity} setQuantity={setQuantity} />
              <button
                onClick={addProductToBill}
                className="w-full mt-4 bg-[#F6AE2D] text-[#011627] py-2 rounded-md hover:bg-blue-500 hover:font-bold"
              >
                Add Product
              </button>
            </>
          ) : (
            <p className="text-center text-[#F6AE2D] text-xl">Select a party first</p>
          )}
        </div>
      </div>

      {/* Middle Section: Bill Viewing Area */}
      <div className="w-2/5 p-6 bg-[#FDFFFC]">
        <BillArea bill={bill} onRemove={handleRemoveItem} onReset={handleReset} onSave={handleSaveBill} />
      </div>

      {/* Right Section: Bill Manager Area */}
      <div className="w-1/5 p-2 bg-zinc-500 border-l-2 border-[#F6AE2D] text-black">
        <BillManager bills={savedBills} onSelect={handleSelectBill} />
      </div>
    </div>
  );
};

export default BillSystem;
