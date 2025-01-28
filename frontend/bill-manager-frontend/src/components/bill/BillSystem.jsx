import React, { useState } from "react";
import CatalogSearch from "./CatalogSearch";
import ProductSearch from "./ProductSearch";
import PartySearch from "./PartySearch";
import PricingSelector from "./PricingSelector";
import QuantityInput from "./QuantityInput";
import BillArea from "./BillArea";
import BillManager from "./BillManager";

const BillSystem = () => {
  const [catalog, setCatalog] = useState("");
  const [product, setProduct] = useState(null);
  const [party, setParty] = useState("");
  const [pricingType, setPricingType] = useState("Normal");
  const [quantity, setQuantity] = useState(1);
  const [bill, setBill] = useState([]);
  const [savedBills, setSavedBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Mock data
  const catalogs = ["Electronics", "Clothing", "Furniture","hellp"];
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
    <div className="flex-grow h-full bg-[#011627] text-[#FDFFFC] flex">
      {/* Left Section: Selection Area */}
      <div className="w-2/5 p-6 border-r-2 border-[#F6AE2D] grid grid-cols-2 grid-rows-2 gap-4">
        <div className="border-2 border-[#F6AE2D] bg-[#011627] p-4 rounded-lg flex flex-col justify-between">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-2 mb-2">
        <img
            src="src/Logo/Catalog.png"
            alt="Catalog Logo"
            className="w-8 h-8 mr-2"
          />
          <h3 className="text-2xl text-white font-bold">Catalogs</h3>
          </div>
          {/* Catalog Search */}
          <CatalogSearch
            options={catalogs}
            onSelect={handleCatalogSelect}
            onClear={() => handleCatalogSelect("")}
            selectedValue={catalog}
          />
          {/* Recent Catalogs */}
          <div className="">
            <h3 className="text-lg font-bold mb-2">Recent Catalogs</h3>
            <div className="flex flex-wrap gap-2">
              {recentCatalogs.map((item, index) => (
                <span
                  key={index}
                  onClick={() => handleCatalogSelect(item)}
                  className="cursor-pointer hover:text-[#FCFFFD] hover:bg-[#F6AE2D] px-3 py-1 border border-[#F6AE2D] rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-2 bg-[#011627] border-[#F6AE2D] p-4 rounded-lg flex flex-col justify-between">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-2 mb-2">
        <img
            src="src/Logo/Product.png"
            alt="Product Logo"
            className="w-8 h-8 mr-2 bg-white rounded-full"
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
                selectedValue={product ? product.name : ""}
              />
              {/* Recent Products */}
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Recent Products</h3>
                <div className="flex flex-wrap gap-2">
                  {recentProducts[catalog].map((item, index) => (
                    <span
                      key={index}
                      onClick={() =>
                        handleProductSelect(products[catalog].find((p) => p.name === item))
                      }
                      className="cursor-pointer hover:text-[#FCFFFD] hover:bg-[#F6AE2D] px-3 py-1 border border-[#F6AE2D] rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-[#F6AE2D] text-xl">Select a catalog first</p>
              </div>
          )}
        </div>

        <div className="border-2 border-[#F6AE2D] bg-[#011627] p-4 rounded-lg flex flex-col justify-between">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-2 mb-2">
        <img
            src="src/Logo/Party.png"
            alt="Party Logo"
            className="w-8 h-8 mr-2"
          />
          <h3 className="text-2xl text-white font-bold">Party</h3>
          </div>
          {/* Party Search */}
          {product ? (
            <>
              <PartySearch
                options={parties}
                onSelect={handlePartySelect}
                onClear={() => handlePartySelect("")}
                selectedValue={party}
              />
              {/* Recent Parties */}
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Recent Parties</h3>
                <div className="flex flex-wrap gap-2">
                  {recentParties.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => handlePartySelect(item)}
                      className="cursor-pointer hover:text-[#FCFFFD] hover:bg-[#F6AE2D] px-3 py-1 border border-[#F6AE2D] rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-[#F6AE2D] text-xl">Select a product first</p>
            </div>
          )}
        </div>

        <div className="border-2 bg-[#011627] border-[#F6AE2D] p-4 rounded-lg flex flex-col justify-between">
        <div className="flex items-center border-b-2 border-[#F6AE2D] pb-2 mb-2">
        <img
            src="src/Logo/Sale.png"
            alt="Sale Logo"
            className="w-8 h-8 mr-2 bg-white rounded-full"
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
                className="w-full mt-4 bg-[#F6AE2D] text-[#011627] py-2 rounded-xl hover:bg-opacity-90 transition"
              >
                Add Product
              </button>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-[#F6AE2D] text-xl">Select a party first</p>
            </div>
          )}
        </div>
      </div>

      {/* Middle Section: Bill Viewing Area */}
      <div className="w-2/5 p-6 bg-[#FDFFFC]">
        <BillArea bill={bill} onRemove={handleRemoveItem} onReset={handleReset} onSave={handleSaveBill} />
      </div>

      {/* Right Section: Bill Manager Area */}
      <div className="w-1/5 p-6 bg-[#FDFFFC] border-l-2 border-[#F6AE2D] text-[#011627]">
        <BillManager bills={savedBills} onSelect={handleSelectBill} />
      </div>
    </div>
  );
};

export default BillSystem;  