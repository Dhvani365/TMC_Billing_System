import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const brands = ["Nike", "Adidas", "Puma", "Reebok"]; // Example brands
const catalogs = {
  Nike: ["Sportswear", "Sneakers", "Accessories"],
  Adidas: ["Running Shoes", "Jerseys", "Bags"],
  Puma: ["Footwear", "Tracksuits"],
  Reebok: ["Gym Wear", "Casual Shoes"],
};
const pricingTypes = ["WSR", "CP", "Fixed Price"];

function PartyDiscount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      brand: "",
      catalog: "",
      partyName: "",
      pricingType: [], // Initialize as an empty array
      fixedDiscount: "",
    });
    const [existingParty, setExistingParty] = useState(null);
    const [catalogOptions, setCatalogOptions] = useState([]);
  
    useEffect(() => {
      if (formData.brand) {
        setCatalogOptions(catalogs[formData.brand] || []);
        setFormData((prev) => ({ ...prev, catalog: "" }));
      } else {
        setCatalogOptions([]);
      }
    }, [formData.brand]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handlePartyCheck = async (e) => {
      const partyName = e.target.value;
      setFormData({ ...formData, partyName });
      if (partyName.trim() !== "") {
        const response = await fetch(`/api/parties?name=${partyName}`);
        const data = await response.json();
        if (data.exists) {
          setExistingParty(data);
          setFormData({
            brand: data.brand,
            catalog: data.catalog,
            partyName: data.partyName,
            pricingType: data.pricingType,
            fixedDiscount: data.fixedDiscount,
          });
        } else {
          setExistingParty(null);
        }
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (existingParty) {
        await fetch(`/api/parties/${existingParty.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`/api/parties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      navigate("/dashboard");
    };
  
    return (
      <div className="flex items-center justify-center h-[100%] bg-gray-100">
        <div className="flex flex-col bg-white p-6 rounded-xl shadow-md w-[40%]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {existingParty ? "Update Party Special Discount" : "Add Party Special Discount"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Select Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Select Catalog</label>
              <select
                name="catalog"
                value={formData.catalog}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!formData.brand}
                required
              >
                <option value="">Select Catalog</option>
                {catalogOptions.map((catalog) => (
                  <option key={catalog} value={catalog}>
                    {catalog}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Party Name</label>
              <input
                type="text"
                name="partyName"
                value={formData.partyName}
                onChange={handlePartyCheck}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Pricing Type</label>
              <div className="flex gap-4">
                {pricingTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name="pricingType"
                      value={type}
                      checked={formData.pricingType.includes(type)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        setFormData((prev) => ({
                          ...prev,
                          pricingType: checked
                            ? [...prev.pricingType, value]
                            : prev.pricingType.filter((t) => t !== value),
                        }));
                      }}
                      className="mr-2 w-4 h-4"
                    />
                    <label>{type}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Fixed Discount (%)</label>
              <input
                type="number"
                name="fixedDiscount"
                value={formData.fixedDiscount}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-900 transition"
            >
              {existingParty ? "Update Party Details" : "Save Party Details"}
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  export default PartyDiscount;