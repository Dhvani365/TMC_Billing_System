import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import pLimit from "p-limit";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AddCatalogs() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();
  const preselectedBrand = location.state?.preselectedBrand || "";

  const [formData, setFormData] = useState({
    brandName: "",
    catalogName: "",
    numberOfSKUs: 0,
    allSKUSamePrice: false,
    gstRate: "",
    skus: [],
    samePrice: {
      wsrPrice: "0",
      cpPrice: "0",
    },
  });

  

  // Fetch brands from the backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/brand`, {
          withCredentials: true,
        });
        setBrands(response.data); // Extract brand names
  
        // If preselectedBrand is set, initialize formData.brandName
        if (preselectedBrand) {
          const selectedBrand = response.data.find((brand) => brand._id === preselectedBrand);
          if (selectedBrand) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              brandName: selectedBrand._id, // Set the preselected brand ID
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching brands:", error.response?.data || error.message);
      }
    };
  
    fetchBrands();
  }, [preselectedBrand]);

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

  const handleSKUsChange = async (index, field, value) => {
    const updatedSKUs = [...formData.skus];
  
    if (field === "skuCode") {
      // Update the SKU number and auto-increment subsequent SKUs
      const newSKUValue = parseInt(value.replace(/\D/g, ""), 10); // Extract numeric part of SKU
      if (!isNaN(newSKUValue)) {
        updatedSKUs[index] = { ...updatedSKUs[index], [field]: `SKU-${newSKUValue}` };
  
        // Auto-increment subsequent SKUs
        for (let i = index + 1; i < updatedSKUs.length; i++) {
          updatedSKUs[i] = { ...updatedSKUs[i], skuCode: `SKU-${newSKUValue + (i - index)}` };
        }
      }
    } 
    else {
      // If the field is "image", get the file from the event directly
      if (field === "image" && value instanceof File) {
        updatedSKUs[index] = { ...updatedSKUs[index], image: value };
      } else {
        // Update other fields (e.g., image, cpPrice, wsrPrice)
        updatedSKUs[index] = { ...updatedSKUs[index], [field]: value };
      }
    }
  
    setFormData({ ...formData, skus: updatedSKUs });
  };
  
  const handleNumberOfSKUsChange = (e) => {
    const numberOfSKUs = parseInt(e.target.value, 10) || 0;
    if (numberOfSKUs > 20) {
      alert("You can only add up to 20 SKUs.");
      return;
    }
  
    const skus = Array.from({ length: numberOfSKUs }, (_, index) => ({
      skuCode: `SKU-${index + 1}`, // Auto-increment SKU numbers starting from 1
      image: null,
      cpPrice: "0",
      wsrPrice: "0",
    }));
    setFormData({ ...formData, numberOfSKUs, skus });
  };

  const handleSamePriceChange = (e) => {
    const { name, value } = e.target;
    const updatedSamePrice = { ...formData.samePrice, [name]: value };

    if (formData.allSKUSamePrice) {
      const updatedSKUs = formData.skus.map((sku) => ({
        ...sku,
        wsrPrice: updatedSamePrice.wsrPrice || "0",
        cpPrice: updatedSamePrice.cpPrice || "0",
      }));
      setFormData({ ...formData, samePrice: updatedSamePrice, skus: updatedSKUs });
    } else {
      setFormData({ ...formData, samePrice: updatedSamePrice });
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🚨 Prevent form from refreshing the page!
    setIsUploading(true);

    try {
      // Your existing catalog creation code
      const catalogResponse = await axios.post(`${BACKEND_URL}/catalog/add`, {
        name: formData.catalogName,
        brand: formData.brandName,
        no_of_skus: formData.numberOfSKUs,
      }, {
        withCredentials: true,
      });
  
      const catalogId = catalogResponse.data._id;
      
      // Upload chunks in parallel with limited concurrency
      const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      };
  
      const limit = pLimit(3); // Max 3 concurrent uploads
      const skuChunks = chunkArray(formData.skus, 2);
  
      const uploadChunk = async (chunk, chunkIndex) => {
        const skuFormData = new FormData();
        skuFormData.append("brand", formData.brandName);
        skuFormData.append("catalog", catalogId);
  
        for (let i = 0; i < chunk.length; i++) {
          const sku = chunk[i];
  
          skuFormData.append(`skus[${i}][sku_number]`, sku.skuCode);
          skuFormData.append(`skus[${i}][cp_price]`, sku.cpPrice);
          skuFormData.append(`skus[${i}][wsr_price]`, sku.wsrPrice);
  
          if (sku.image instanceof File) {
            try {
              const compressed = await imageCompression(sku.image, {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 300,
                useWebWorker: true,
              });
  
              const file = new File([compressed], sku.image.name, {
                type: compressed.type,
                lastModified: sku.image.lastModified,
              });
  
              skuFormData.append(`skus[${i}][image]`, file);
            } catch (err) {
              console.error("Compression error:", err);
            }
          }
        }
  
        await axios.post(`${BACKEND_URL}/sku/add`, skuFormData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
  
        console.log(`✅ Batch ${chunkIndex + 1} uploaded`);
      };
  
      await Promise.all(
        skuChunks.map((chunk, idx) => limit(() => uploadChunk(chunk, idx)))
      );
  
      alert("✅ Catalog and SKUs added successfully!");
      navigate("/home/view-catalogs");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("❌ Failed to upload catalog/SKUs");
    }
    finally {
      setIsUploading(false); // ⬅️ Hide loader after upload
    }
  };
  
  return (
     
    <div className="flex flex-row h-screen">
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="loader mb-2 border-4 border-green-500 border-t-transparent rounded-full w-8 h-8 animate-spin mx-auto" />
            <p className="text-gray-700 mt-2">Uploading SKUs, please wait...</p>
          </div>
        </div>
      )}

      {/* Back to Catalogs Button */}
      <button
        onClick={() => navigate("/home/view-catalogs")}
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
                value={formData.brandName} // Use brandId as the value
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  preselectedBrand ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "focus:ring-green-500"
                }`}
                required
                disabled={!!preselectedBrand} // Disable dropdown if preselectedBrand is set
              >
                {preselectedBrand ? (
                  // Show only the preselected brand
                  <option value={formData.brandName}>
                    {brands.find((brand) => brand._id === preselectedBrand)?.name || "Selected Brand"}
                  </option>
                ) : (
                  // Show all brands if no preselected brand
                  <>
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </>
                )}
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
                  <label className="block text-gray-600 mb-1">WSR Price</label>
                  <input
                    type="number"
                    name="wsrPrice"
                    value={formData.samePrice.wsrPrice || "0"}
                    onChange={handleSamePriceChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <label className="block text-gray-600 mb-1 mt-2">CP Price</label>
                  <input
                    type="number"
                    name="cpPrice"
                    value={formData.samePrice.cpPrice || "0"}
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
                <label className="block text-gray-600 mb-1">WSR Price</label>
                <input
                  type="number"
                  value={sku.wsrPrice || "0"}
                  onChange={(e) => handleSKUsChange(index, "wsrPrice", e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={formData.allSKUSamePrice}
                  
                />
              </div>
              <div className="mb-1 text-sm">
                <label className="block text-gray-600 mb-1">CP Price</label>
                <input
                  type="number"
                  value={sku.cpPrice || "0"}
                  onChange={(e) => handleSKUsChange(index, "cpPrice", e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={formData.allSKUSamePrice}
                  
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
