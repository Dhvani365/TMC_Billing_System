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

  // Mock data
  const catalogs = ["Electronics", "Clothing", "Furniture"];
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

  const recentCatalogs = ["Electronics", "Clothing"];
  const recentProducts = {
    Electronics: ["Laptop", "Phone"],
    Clothing: ["Shirt", "Jeans"],
    Furniture: ["Chair", "Table"],
  };
  const recentParties = ["Party A", "Party B"];

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

  return (
    <div className="flex-grow h-full bg-[#011627] text-[#FDFFFC] flex">
      {/* Left Section: Selection Area */}
      <div className="w-2/3 p-6 border-r border-[#F6AE2D] grid grid-cols-2 grid-rows-2 gap-4">
        <div className="border border-[#F6AE2D] p-4 rounded-lg">
          {/* Catalog Search */}
          <CatalogSearch
            options={catalogs}
            onSelect={handleCatalogSelect}
            onClear={() => handleCatalogSelect("")}
          />
          {/* Recent Catalogs */}
          <div className="mt-4">
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
          </div>
        </div>

        <div className="border border-[#F6AE2D] p-4 rounded-lg">
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
              {/* Recent Products */}
              <div className="mt-4">
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
              </div>
            </>
          ) : (
            <p className="text-center text-[#F6AE2D]">Select a catalog first</p>
          )}
        </div>

        <div className="border border-[#F6AE2D] p-4 rounded-lg">
          {/* Party Search */}
          {product ? (
            <>
              <PartySearch
                options={parties}
                onSelect={handlePartySelect}
                onClear={() => handlePartySelect("")}
              />
              {/* Recent Parties */}
              <div className="mt-4">
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
              </div>
            </>
          ) : (
            <p className="text-center text-[#F6AE2D]">Select a product first</p>
          )}
        </div>

        <div className="border border-[#F6AE2D] p-4 rounded-lg">
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
                className="w-full mt-4 bg-[#F6AE2D] text-[#011627] py-2 rounded-xl hover:bg-opacity-90 transition"
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
      <div className="w-1/3 p-6">
        <BillArea bill={bill} onRemove={handleRemoveItem} onReset={handleReset} />
      </div>
    </div>
  );
};

export default BillSystem;