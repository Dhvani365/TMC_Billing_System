import React, { useState } from "react";
import CatalogSearch from "./CatalogSearch";
import ProductSearch from "./ProductSearch";
import PartySearch from "./PartySearch";
import PricingSelector from "./PricingSelector";
import QuantityInput from "./QuantityInput";
import BillArea from "./BillArea";

const BillSystem = () => {
  const [catalog, setCatalog] = useState("");
  const [product, setProduct] = useState(null);
  const [party, setParty] = useState("");
  const [pricingType, setPricingType] = useState("Normal");
  const [quantity, setQuantity] = useState(1);
  const [bill, setBill] = useState([]);
  const [showMoreCatalog, setShowMoreCatalog] = useState(false);
  const [showMoreProduct, setShowMoreProduct] = useState(false);
  const [showMoreParty, setShowMoreParty] = useState(false);

  // Mock data
  const catalogs = ["Electronics", "Clothing", "Furniture","Hello World"];
  const products = {
    Electronics: [
      { name: "Laptop", price: 1000 },
      { name: "Phone", price: 500 },
    ],
    Clothing: [
      { name: "Shirt", price: 50 },
      { name: "Jeans", price: 80 },
    ],
    Furniture: [
      { name: "Chair", price: 150 },
      { name: "Table", price: 200 },
    ],
  };
  const parties = ["Party A", "Party B", "Party C"];
  const discounts = { Normal: 0, Wholesale: 10 }; // Discount percentage

  // const recentCatalogs = ["Electronics", "Clothing"];
  // const recentProducts = {
  //   Electronics: ["Laptop", "Phone"],
  //   Clothing: ["Shirt", "Jeans"],
  //   Furniture: ["Chair", "Table"],
  // };

  // const recentParties = ["Party A", "Party B"];

  const addProductToBill = () => {
    if (!catalog || !product || !party || quantity <= 0) {
      alert("Please fill all fields before adding the product.");
      return;
    }

    const discount = (product.price * discounts[pricingType]) / 100;
    const totalPrice = (product.price - discount) * quantity;

    setBill((prevBill) => [
      ...prevBill,
      {
        product: product.name,
        party,
        pricingType,
        price: product.price,
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

  // bg-[#011627] text-[#FDFFFC]
  return (
    <div className="flex-grow h-full bg-zinc-700 text-white flex text-xl">
      {/* Left Section: Selection Area */}
      <div className="w-[50%] p-4 border-r border-[#F6AE2D] grid grid-cols-2 grid-rows-2 gap-4">
        <div className="border border-black bg-zinc-950 p-5 rounded-md">
          {/* Logo */}
        <div className="flex items-center mb-4">
        <img
            src="src/Logo/Catalog.png"
            alt="Catalog Logo"
            className="w-10 h-10 mr-4"
          />
          <h3 className="text-2xl text-white font-bold">Catalogs</h3>
          </div>

          {/* Catalog Search */}
          <CatalogSearch
            options={catalogs}
            onSelect={handleCatalogSelect}
            onClear={() => handleCatalogSelect("")}
          />
          
          {/* Show More Button */}
          {catalogs.length > 3 && !showMoreCatalog && (
            <button
              onClick={() => setShowMoreCatalog(true)}
              className="text-[#F6AE2D] mt-3"
            >
              Show More...
            </button>
          )}
          {/* Recent Catalogs */}
          {/* <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Recent Catalogs</h3>
            <ul>
              {recentCatalogs.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleCatalogSelect(item)}
                  className="cursor-pointer hover:text-[#F6AE2D]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <div className="border border-black bg-zinc-950 p-5 rounded-md">
        <div className="flex items-center mb-4">
        <img
            src="src/Logo/Party.png"
            alt="Party Logo"
            className="w-10 h-10 mr-4"
          />
          <h3 className="text-2xl text-white font-bold">Parties</h3>
          </div>
          {/* Party Search */}
          {product ? (
            <>
              <PartySearch
                options={parties}
                onSelect={handlePartySelect}
                onClear={() => handlePartySelect("")}
              />
              {/* Show More Button */}
              {parties.length > 1 && !showMoreParty && (
                <button
                  onClick={() => setShowMoreParty(true)}
                  className="text-[#F6AE2D] mt-3"
                >
                  Show More...
                </button>
              )}
              {/* Recent Parties */}
              {/* <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Recent Parties</h3>
                <ul>
                  {recentParties.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handlePartySelect(item)}
                      className="cursor-pointer hover:text-[#F6AE2D]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}
            </>
          ) : (
            <p className="text-center text-[#F6AE2D]">Select a product first</p>
          )}
        </div>

        <div className="border border-black bg-zinc-950 p-5 rounded-md">
        <div className="flex items-center mb-4">
        <img
            src="src/Logo/Product.png"
            alt="Product Logo"
            className="w-10 h-10 mr-4 bg-white"
          />
          <h3 className="text-2xl text-white font-bold">Products</h3>
          </div>

          {/* Product Search */}
          {catalog ? (
            <>
              <ProductSearch
                options={products[catalog].map((p) => p.name)}
                onSelect={(selectedProduct) =>
                  handleProductSelect(products[catalog].find((p) => p.name === selectedProduct))
                }
                onClear={() => handleProductSelect(null)}
              />
              {/* Show More Button */}
              {products[catalog].length > 1 && !showMoreProduct && (
                <button
                  onClick={() => setShowMoreProduct(true)}
                  className="text-[#F6AE2D] mt-3"
                >
                  Show More...
                </button>
              )}
              {/* Recent Products */}
              {/* <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Recent Products</h3>
                <ul>
                  {recentProducts[catalog].map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleProductSelect(products[catalog].find((p) => p.name === item))}
                      className="cursor-pointer hover:text-[#F6AE2D]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}
            </>
          ) : (
            <p className="text-center text-[#F6AE2D]">Select a catalog first</p>
          )}
        </div>

        <div className="border border-black bg-zinc-950 p-5 rounded-md">
        <div className="flex items-center mb-5">
        <img
            src="src/Logo/Sale.png"
            alt="Sale Logo"
            className="w-10 h-8 mr-4 bg-white"
          />
          <h3 className="text-2xl text-white font-bold">Pricing</h3>
          </div>
          {/* Pricing Selector and Quantity Input */}
          {party ? (
            <>
              <PricingSelector
                pricingType={pricingType}
                setPricingType={setPricingType}
              />
              <QuantityInput quantity={quantity} setQuantity={setQuantity} />
              {/* Add Product Button */}
              <button
                onClick={addProductToBill}
                className="w-full mt-3 bg-blue-400 text-white font-bold py-2 rounded-xl hover:bg-opacity-90 transition"
              >
                Add Product
              </button>
            </>
          ) : (
            <p className="text-center text-[#F6AE2D]">Select a party first</p>
          )}
        </div>
      </div>

      {/* Right Section: Bill Viewing Area */}
      <div className="w-1/2 p-8">
        <BillArea bill={bill} onRemove={handleRemoveItem} onReset={handleReset} />
      </div>
    </div>
  );
};

export default BillSystem;