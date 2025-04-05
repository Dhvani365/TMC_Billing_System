import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddPricingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const clientData = location.state?.clientData;

  const [brands, setBrands] = useState([]); // Fetch brands from the backend
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Fetch brands from the backend
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/brand");
        setBrands(response.data); // Set the fetched brands in state
      } catch (error) {
        console.error("Error fetching brands:", error.response?.data || error.message);
        alert("Failed to fetch brands. Please try again.");
      }
    };

    fetchBrands();
    searchInputRef.current?.focus();
  }, []);

  const handleBrandSelection = (brandId) => {
    if (selectedBrands.some((brand) => brand.id === brandId)) {
      setSelectedBrands(selectedBrands.filter((brand) => brand.id !== brandId));
    } else {
      const selectedBrand = brands.find((brand) => brand._id === brandId);
      setSelectedBrands([
        ...selectedBrands,
        {
          id: brandId,
          discount: false,
          discountValue: "",
          pricingType: selectedBrand.available_prices?.length === 1
            ? selectedBrand.available_prices[0]
            : "WSR", // Default to "Both" if both options are available
        },
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

  const handleSave = async () => {
    try {
      const payload = {
        name: clientData.name,
        address: clientData.address,
        gst_no: clientData.gst,
        preferred_courier: clientData.courier,
        list_of_selected_brands: selectedBrands.map((brand) => ({
          brand_id: brand.id,
          pricing_type: brand.pricingType, // Send the selected pricing type
          discount: brand.discount ? brand.discountValue : 0,
        })),
      };

      console.log("Payload being sent:", payload);

      // Make POST request to the backend
      await axios.post("http://localhost:3000/api/party/add", payload);

      alert("Party and pricing details saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving party and pricing details:", error.response?.data || error.message);
      alert("Failed to save party and pricing details. Please try again.");
    }
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
            const isSelected = selectedBrands.some((b) => b.id === brand._id);
            const selectedBrand = selectedBrands.find((b) => b.id === brand._id);
            return (
              <div
                key={brand._id}
                className={`p-4 mb-4 rounded-lg shadow-md ${
                  isSelected ? "bg-green-50 border-l-4 border-green-500" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between cursor-pointer">
                  <div
                    className="flex items-center"
                    onClick={() => handleBrandSelection(brand._id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandSelection(brand._id)}
                      className="mr-3 h-4 w-4"
                    />
                    <span className="text-lg font-medium">{brand.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Pricing Type:{" "}
                    {brand.available_prices?.length === 1
                      ? brand.available_prices[0]
                      : brand.available_prices?.includes("WSR") && brand.available_prices?.includes("CP")
                      ? "Both"
                      : "N/A"}
                  </span>
                </div>
                {isSelected && (
                  <div className="mt-4">
                    {brand.available_prices?.includes("WSR") &&
                      brand.available_prices?.includes("CP") && (
                        <div className="flex items-center gap-4">
                          <label className="text-gray-700 font-medium">Select Pricing Type:</label>
                          <label>
                            <input
                              type="radio"
                              name={`pricingType-${brand._id}`}
                              value="WSR"
                              checked={selectedBrand?.pricingType === "WSR" || selectedBrand?.pricingType === "Both" }
                              onChange={(e) =>
                                handleBrandDetailsChange(brand._id, "pricingType", e.target.value)
                              }
                              className="mr-2"
                            />
                            WSR
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`pricingType-${brand._id}`}
                              value="CP"
                              checked={selectedBrand?.pricingType === "CP"}
                              onChange={(e) =>
                                handleBrandDetailsChange(brand._id, "pricingType", e.target.value)
                              }
                              className="mr-2"
                            />
                            CP
                          </label>
                        </div>
                      )}
                    <div className="flex items-center gap-4 mt-4">
                      <label className="text-gray-700 font-medium">Discount?</label>
                      <input
                        type="checkbox"
                        checked={selectedBrand?.discount || false}
                        onChange={(e) =>
                          handleBrandDetailsChange(brand._id, "discount", e.target.checked)
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
                              brand._id,
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