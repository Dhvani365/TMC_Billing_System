import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AddPricingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const clientData = location.state?.clientData;

  const [brands, setBrands] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Brand ${i + 1}`,
      pricingType: i % 3 === 0 ? "WSR" : i % 3 === 1 ? "CP" : "Both", // Example pricing types
    }))
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleBrandSelection = (brandId) => {
    if (selectedBrands.some((brand) => brand.id === brandId)) {
      setSelectedBrands(selectedBrands.filter((brand) => brand.id !== brandId));
    } else {
      const selectedBrand = brands.find((brand) => brand.id === brandId);
      setSelectedBrands([
        ...selectedBrands,
        { id: brandId, discount: false, discountValue: "", cp: false, wsr: false },
      ]);
    }
  };

  const handleBrandDetailsChange = (brandId, field, value) => {
    setSelectedBrands((prev) =>
      prev.map((brand) =>
        brand.id === brandId ? { ...brand, [field]: value } : brand
      )
    );
  };

  const handleSave = () => {
    console.log("Client Data:", clientData);
    console.log("Selected Brands:", selectedBrands);
    alert("Pricing details saved successfully!");
    navigate("/");
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-md w-[60%] max-h-[90%] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Pricing for Party</h2>
        <div className="mb-6">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-6 max-h-[400px] overflow-y-auto border-t border-b">
          {filteredBrands.map((brand) => {
            const isSelected = selectedBrands.some((b) => b.id === brand.id);
            const selectedBrand = selectedBrands.find((b) => b.id === brand.id);
            return (
              <div
                key={brand.id}
                className={`p-4 mb-4 rounded-lg shadow-md ${
                  isSelected ? "bg-green-50 border-l-4 border-green-500" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center"
                    onClick={() => handleBrandSelection(brand.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandSelection(brand.id)}
                      className="mr-3 h-4 w-4"
                    />
                    <span className="text-lg font-medium">{brand.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Pricing Type: {brand.pricingType}
                  </span>
                </div>
                {isSelected && (
                  <div className="mt-4">
                    {brand.pricingType === "WSR" && (
                      <div className="flex items-center gap-4">
                        <label className="text-gray-700 font-medium">Less/Discount?</label>
                        <input
                          type="checkbox"
                          checked={selectedBrand?.discount || false}
                          onChange={(e) =>
                            handleBrandDetailsChange(brand.id, "discount", e.target.checked)
                          }
                          className="mr-2 h-4 w-4"
                        />
                        {selectedBrand?.discount && (
                          <input
                            type="number"
                            placeholder="Enter Discount %"
                            value={selectedBrand?.discountValue || ""}
                            onChange={(e) =>
                              handleBrandDetailsChange(
                                brand.id,
                                "discountValue",
                                e.target.value
                              )
                            }
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        )}
                      </div>
                    )}
                    {brand.pricingType === "CP" && (
                      <div className="flex items-center gap-4">
                        <label className="text-gray-700 font-medium">Less/Discount?</label>
                        <input
                          type="checkbox"
                          checked={selectedBrand?.discount || false}
                          onChange={(e) =>
                            handleBrandDetailsChange(brand.id, "discount", e.target.checked)
                          }
                          className="mr-2 h-4 w-4"
                        />
                        {selectedBrand?.discount && (
                          <input
                            type="number"
                            placeholder="Enter Discount %"
                            value={selectedBrand?.discountValue || ""}
                            onChange={(e) =>
                              handleBrandDetailsChange(
                                brand.id,
                                "discountValue",
                                e.target.value
                              )
                            }
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        )}
                      </div>
                    )}
                    {brand.pricingType === "Both" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center gap-4">
                          <label className="text-gray-700 font-medium">
                            WSR
                          </label>
                          <input
                            type="checkbox"
                            checked={selectedBrand?.wsr || false}
                            onChange={(e) =>
                              handleBrandDetailsChange(brand.id, "wsr", e.target.checked)
                            }
                            className="mr-2 h-4 w-4"
                          />
                          <label className="text-gray-700 font-medium">
                            CP
                          </label>
                          <input
                            type="checkbox"
                            checked={selectedBrand?.cp || false}
                            onChange={(e) =>
                              handleBrandDetailsChange(brand.id, "cp", e.target.checked)
                            }
                            className="mr-2 h-4 w-4"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                        <label className="text-gray-700 font-medium">Less/Discount?</label>
                        <input
                          type="checkbox"
                          checked={selectedBrand?.discount || false}
                          onChange={(e) =>
                            handleBrandDetailsChange(brand.id, "discount", e.target.checked)
                          }
                          className="mr-2 h-4 w-4"
                        />
                        {selectedBrand?.discount && (
                          <input
                            type="number"
                            placeholder="Enter Discount %"
                            value={selectedBrand?.discountValue || ""}
                            onChange={(e) =>
                              handleBrandDetailsChange(
                                brand.id,
                                "discountValue",
                                e.target.value
                              )
                            }
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPricingForm;