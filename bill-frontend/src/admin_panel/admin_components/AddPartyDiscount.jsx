import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function PartyDiscount({ onSaveSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand_id: "",
    catalog_id: "",
    party_id: "",
    price_type: "",
    discount: "",
  });
  const [brands, setBrands] = useState([]);
  const [catalogOptions, setCatalogOptions] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availablePrices, setAvailablePrices] = useState([]); // To store available price types
  // Fetch brands from the backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/brand`, {
          withCredentials: true,
        });
        setBrands(response.data);
      } catch (err) {
        setError("Failed to fetch brands. Please try again.");
      }
    };

    fetchBrands();
  }, []);

  // Fetch catalogs when a brand is selected
  useEffect(() => {
    const fetchCatalogs = async () => {
      if (formData.brand_id) {
        try {
          const response = await axios.get(`${BACKEND_URL}/catalog/brandid/${formData.brand_id}`, {
            withCredentials: true,
          });
          if(response.status !== 200) {
            alert("Catalog Does not exists for this Brand! First Add catalogs!");
            navigate("/home/add-catalog");
          }
          setCatalogOptions(response.data);

          // Get the selected brand's available prices
          const selectedBrand = brands.find((brand) => brand._id === formData.brand_id);
          if (selectedBrand) {
            setAvailablePrices(selectedBrand.available_prices || []);
          }
        } catch (err) {
          setError("Failed to fetch catalogs. Please try again.");
        }
      } else {
        setCatalogOptions([]);
      }
    };

    fetchCatalogs();
  }, [formData.brand_id]);

  // Fetch parties from the backend
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/party`, {
          withCredentials: true,
        });
        setParties(response.data);
      } catch (err) {
        setError("Failed to fetch parties. Please try again.");
      }
    };

    fetchParties();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const specialDiscountData = {
        party_id: formData.party_id,
        brand_id: formData.brand_id,
        catalog_id: formData.catalog_id,
        discount: formData?.discount || 0,
        price_type: formData.price_type,
        status: true, // Default status
      };

      // Add new special discount
      await axios.post(`${BACKEND_URL}/specialdiscount/add`, specialDiscountData, {
        withCredentials: true,
      });
      
      alert("Party discount added successfully!");
      if (onSaveSuccess) {
        onSaveSuccess(); // Trigger the callback to toggle showAddDiscount
      }
    } catch (err) {
      setError("Failed to save party discount. "+ err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100%] bg-gray-100">
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-md w-[40%]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Party Special Discount</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Select Brand</label>
            <select
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Select Catalog</label>
            <select
              name="catalog_id"
              value={formData.catalog_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={!formData.brand_id}
              required
            >
              <option value="">Select Catalog</option>
              {catalogOptions.map((catalog) => (
                <option key={catalog._id} value={catalog._id}>
                  {catalog.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Select Party</label>
            <select
              name="party_id"
              value={formData.party_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Party</option>
              {parties.map((party) => (
                <option key={party._id} value={party._id}>
                  {party.name}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-600 mb-1">Pricing Type</label>
            <div className="flex gap-4">
              {["WSR", "CP", "Fixed Price"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="price_type"
                    value={type}
                    checked={formData.price_type === type}
                    onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                    className="mr-2 w-4 h-4"
                  />
                  <label>{type}</label>
                </div>
              ))}
            </div>
          </div> */}

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Pricing Type</label>
            <div className="flex gap-4">
              {availablePrices.includes("WSR") && (
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="price_type"
                    value="WSR"
                    checked={formData.price_type === "WSR"}
                    onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                    className="mr-2 w-4 h-4"
                  />
                  <label>WSR</label>
                </div>
              )}
              {availablePrices.includes("CP") && (
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="price_type"
                    value="CP"
                    checked={formData.price_type === "CP"}
                    onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                    className="mr-2 w-4 h-4"
                  />
                  <label>CP</label>
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="radio"
                  name="price_type"
                  value="Fixed Price"
                  checked={formData.price_type === "Both"}
                  onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                  className="mr-2 w-4 h-4"
                />
                <label>Fixed Price</label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Fixed Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={formData.price_type === "Fixed Price"} // Disable if "Fixed Price" is selected
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-900 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Party Discount"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PartyDiscount;