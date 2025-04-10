import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddCatalogs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brandName: "",
    catalogName: "",
    numberOfSKUs: 0,
    allSKUSamePrice: false,
    gstRate: "",
    skus: [],
    samePrice: {
      wsrPrice: "",
      cpPrice: "",
    },
  });

  const [brands, setBrands] = useState([]);

  // Fetch brands from the backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/brand");
        setBrands(response.data); // Extract brand names
      } catch (error) {
        console.error("Error fetching brands:", error.response?.data || error.message);
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: value ? parseInt(value, 10) : "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSKUsChange = (index, field, value) => {
    const updatedSKUs = [...formData.skus];
    updatedSKUs[index] = { ...updatedSKUs[index], [field]: value };
    setFormData({ ...formData, skus: updatedSKUs });
  };

  const handleNumberOfSKUsChange = (e) => {
    const numberOfSKUs = parseInt(e.target.value, 10) || 0;
    if (numberOfSKUs > 20) {
      alert("You can only add up to 20 SKUs.");
      return;
    }
  
    const skus = Array.from({ length: numberOfSKUs }, (_, index) => ({
      skuCode: `SKU-${index + 1}`,
      image: null,
      cpPrice: "",
      wsrPrice: "",
    }));
    setFormData({ ...formData, numberOfSKUs, skus });
  };

  const handleSamePriceChange = (e) => {
    const { name, value } = e.target;
    const updatedSamePrice = { ...formData.samePrice, [name]: value };

    if (formData.allSKUSamePrice) {
      const updatedSKUs = formData.skus.map((sku) => ({
        ...sku,
        wsrPrice: updatedSamePrice.wsrPrice,
        cpPrice: updatedSamePrice.cpPrice,
      }));
      setFormData({ ...formData, samePrice: updatedSamePrice, skus: updatedSKUs });
    } else {
      setFormData({ ...formData, samePrice: updatedSamePrice });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add catalog
      const catalogResponse = await axios.post("http://localhost:3000/api/catalog/add", {
        name: formData.catalogName,
        brand: formData.brandName,
        no_of_skus: formData.numberOfSKUs,
      });

      // console.log("Catalog ID:", catalogResponse.data._id);
      const catalogId = catalogResponse.data._id;
      // Add SKUs
      const skuFormData = new FormData();
      skuFormData.append("brand", formData.brandName);
      skuFormData.append("catalog", catalogId);
      formData.skus.forEach((sku, index) => {
        if (!sku.skuCode || !sku.cpPrice || !sku.wsrPrice ) {
          throw new Error(`Missing required fields for SKU at index ${index}`);
        }
        skuFormData.append(`skus[${index}][sku_number]`, sku.skuCode);
        skuFormData.append(`skus[${index}][cp_price]`, sku.cpPrice);
        skuFormData.append(`skus[${index}][wsr_price]`, sku.wsrPrice);
        if (sku.image instanceof File) {
          skuFormData.append(`skus[${index}][image]`, sku.image);
        }
      });

      await axios.post("http://localhost:3000/api/sku/add", skuFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Catalog and SKUs added successfully!");
      navigate("/view-catalogs");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error?.message || "An unexpected error occurred";
      alert(`Failed to add catalog or SKUs: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      {/* Back to Catalogs Button */}
      <button
        onClick={() => navigate("/view-catalogs")}
        className="absolute top-2 right-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-900 transition"
      >
        Back to Catalogs
      </button>

      {/* Form Section */}
      <div className="w-[33%] ml-[2%] flex items-center justify-center">
        <div className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Catalog</h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Brand Name</label>
            <select
              name="brandName"
              value={formData.brandName} // now just an ID string
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <label className="block text-gray-600 mb-1">Catalog Name</label>
              <input
                type="text"
                name="catalogName"
                value={formData.catalogName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Number of SKUs</label>
              <input
                type="number"
                name="numberOfSKUs"
                value={formData.numberOfSKUs}
                onChange={handleNumberOfSKUsChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="allSKUSamePrice"
                  checked={formData.allSKUSamePrice}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>All SKUs Same Price</label>
              </div>
              {formData.allSKUSamePrice && (
                <div className="mt-4">
                  <label className="block text-gray-600 mb-1 mt-2">CP Price</label>
                  <input
                    type="number"
                    name="cpPrice"
                    value={formData.samePrice.cpPrice}
                    onChange={handleSamePriceChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <label className="block text-gray-600 mb-1">WSR Price</label>
                  <input
                    type="number"
                    name="wsrPrice"
                    value={formData.samePrice.wsrPrice}
                    onChange={handleSamePriceChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-200 hover:text-black transition"
            >
              Save
            </button>
          </form>
        </div>
      </div>

      {/* SKUs Section */}
      <div className="w-[65%] p-6 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {formData.skus.map((sku, index) => (
            <div key={index} className="text-sm border p-3 rounded-md shadow-md bg-white">
              <h3 className="text-sm font-semibold mb-2">SKU {index + 1}</h3>
              <div className="mb-1 text-sm">
                <label className="block text-gray-600 mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku.skuCode}
                  onChange={(e) => handleSKUsChange(index, "skuCode", e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-1 text-sm">
                <label className="block text-gray-600 mb-1">Image</label>
                <input
                  type="file"
                  onChange={(e) => handleSKUsChange(index, "image", e.target.files[0])}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-1 text-sm">
                <label className="block text-gray-600 mb-1">CP Price</label>
                <input
                  type="number"
                  value={sku.cpPrice}
                  onChange={(e) => handleSKUsChange(index, "cpPrice", e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={formData.allSKUSamePrice}
                  required
                />
              </div>
              <div className="mb-1 text-sm">
                <label className="block text-gray-600 mb-1">WSR Price</label>
                <input
                  type="number"
                  value={sku.wsrPrice}
                  onChange={(e) => handleSKUsChange(index, "wsrPrice", e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={formData.allSKUSamePrice}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddCatalogs;