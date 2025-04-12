import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CatalogList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]); // Store fetched brands
  const [catalogs, setCatalogs] = useState([]); // Store fetched catalogs
  const [skus, setSkus] = useState([]); // Store fetched SKUs
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCatalog, setSelectedCatalog] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkus, setSelectedSkus] = useState([]); // Track selected SKUs
  const [editingSku, setEditingSku] = useState(null); // Track the SKU being edited
  const [editedSkuData, setEditedSkuData] = useState({}); // Store edited SKU data
  const searchInputRef = useRef(null); // Ref for the search bar

  // Focus on the search bar when it is rendered
  useEffect(() => {
    if (selectedCatalog && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [selectedCatalog]);
  
  // Fetch all brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/brand");
        setBrands(response.data); // Populate brands dropdown
      } catch (error) {
        console.error("Error fetching brands:", error.response?.data || error.message);
        alert("Failed to fetch brands. Please try again.");
      }
    };

    fetchBrands();
  }, []);

  // Fetch catalogs when a brand is selected
  useEffect(() => {
    if (selectedBrand) {
      const fetchCatalogs = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/catalog/brandid/${selectedBrand}`);
          setCatalogs(response.data); // Populate catalogs dropdown
        } catch (error) {
          console.error("Error fetching catalogs:", error.response?.data || error.message);
          alert("Failed to fetch catalogs. Please try again.");
        }
      };

      fetchCatalogs();
    } else {
      setCatalogs([]); // Clear catalogs if no brand is selected
      setSkus([]); // Clear SKUs if no brand is selected
    }
  }, [selectedBrand]);

  // Fetch SKUs when a catalog is selected
  useEffect(() => {
    if (selectedCatalog) {
      const fetchSkus = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/sku/catalog/${selectedCatalog}`);
          setSkus(response.data); // Populate SKUs
        } catch (error) {
          console.error("Error fetching SKUs:", error.response?.data || error.message);
          alert("Failed to fetch SKUs. Please try again.");
        }
      };

      fetchSkus();
    } else {
      setSkus([]); // Clear SKUs if no catalog is selected
    }
  }, [selectedCatalog]);

  // Filter SKUs based on search term
  const filteredSKUs = skus.filter((sku) =>
    sku.sku_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox selection
  const handleSkuSelect = (id) => {
    setSelectedSkus((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((skuId) => skuId !== id) // Unselect if already selected
        : [...prevSelected, id] // Select the SKU
    );
  };

  // Handle exporting selected SKUs
  const handleExportSkus = () => {
    const exportedData = skus.filter((sku) => selectedSkus.includes(sku._id));
    console.log("Exported SKUs Data:", exportedData);
    alert("Exported SKUs data has been logged to the console.");
  };

  // Handle editing a SKU
  const handleEditSku = (id) => {
    setEditingSku(id);
    const skuToEdit = skus.find((sku) => sku._id === id);
    setEditedSkuData(skuToEdit);
  };

  // Handle saving edited SKU data
  const handleSaveSku = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/sku/update/${id}`, editedSkuData);
      alert("SKU updated successfully!");
      setSkus((prevSkus) =>
        prevSkus.map((sku) => (sku._id === id ? { ...sku, ...editedSkuData } : sku))
      );
      setEditingSku(null);
      setEditedSkuData({});
    } catch (error) {
      console.error("Error updating SKU:", error.response?.data || error.message);
      alert("Failed to update SKU. Please try again.");
    }
  };

  // Handle deleting a SKU
  const handleDeleteSku = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/sku/delete/${id}`);
      alert("SKU deleted successfully!");
      setSkus((prevSkus) => prevSkus.filter((sku) => sku._id !== id));
    } catch (error) {
      console.error("Error deleting SKU:", error.response?.data || error.message);
      alert("Failed to delete SKU. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catalog List</h1>

      {/* Dropdowns + Add Catalog Button */}
      <div className="flex items-center gap-4 mb-6">
        {/* Brand Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Select Brand</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedCatalog(""); // Reset catalog when brand changes
            }}
          >
            <option value="">-- Select Brand --</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Catalog Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Select Catalog</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedCatalog}
            onChange={(e) => setSelectedCatalog(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">-- Select Catalog --</option>
            {catalogs.map((catalog) => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        {selectedCatalog && (
          <div className="mt-7">
            <input
              type="text"
              placeholder="Search SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={searchInputRef} // Attach ref to the search bar
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
        <button
          onClick={() => navigate("/home/add-catalog")}
          className="bg-green-500 text-white px-4 py-2 mt-7 rounded-md hover:bg-green-600 transition"
        >
          + Add Catalog
        </button>
      </div>

      {/* Export Button */}
      {selectedSkus.length > 0 && (
        <button
          onClick={handleExportSkus}
          className="bg-green-500 text-white px-4 py-2 mb-4 rounded-md hover:bg-green-600"
        >
          Export Selected SKUs
        </button>
      )}

      {/* Display SKUs */}
      {selectedCatalog && filteredSKUs.length > 0 ? (
        <div className="grid grid-cols-6 gap-4">
          {filteredSKUs.map((sku) => (
            <div key={sku._id} className="border p-4 rounded-md shadow-md bg-white">
              <input
                type="checkbox"
                checked={selectedSkus.includes(sku._id)}
                onChange={() => handleSkuSelect(sku._id)}
                className="mb-2"
              />
              {editingSku === sku._id ? (
                <>
                  <input
                    type="text"
                    value={editedSkuData.sku_number}
                    onChange={(e) =>
                      setEditedSkuData({ ...editedSkuData, sku_number: e.target.value })
                    }
                    className="w-full p-1 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editedSkuData.cp_price?.$numberDecimal}
                    onChange={(e) =>
                      setEditedSkuData({ ...editedSkuData, cp_price: e.target.value })
                    }
                    className="w-full p-1 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editedSkuData.wsr_price?.$numberDecimal}
                    onChange={(e) =>
                      setEditedSkuData({ ...editedSkuData, wsr_price: e.target.value })
                    }
                    className="w-full p-1 border rounded mb-2"
                  />
                  <button
                    onClick={() => handleSaveSku(sku._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={sku.image || null}
                    alt={sku.sku_number}
                    className="w-full h-24 object-cover mb-2 rounded-md"
                  />
                  <h3 className="text-lg font-semibold">{sku.sku_number}</h3>
                  <p className="text-sm text-gray-700">
                    CP Price: <strong>${parseFloat(sku.cp_price?.$numberDecimal || sku.cp_price).toFixed(2)}</strong>
                  </p>
                  <p className="text-sm text-gray-700">
                    WSR Price: <strong>${parseFloat(sku.wsr_price?.$numberDecimal || sku.wsr_price).toFixed(2)}</strong>
                  </p>
                  <button
                    onClick={() => handleEditSku(sku._id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSku(sku._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        selectedCatalog && <p className="text-gray-500">No SKUs available for this catalog.</p>
      )}
    </div>
  );
}