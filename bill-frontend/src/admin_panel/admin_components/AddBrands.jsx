import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AddBrands({onSave}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brandName: '',
    gst: '',
    pricing: {
      WSR: false,
      CP: false,
    },
    gstOption: '5%', // Default GST option
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        pricing: {
          ...prevData.pricing,
          [name]: checked,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGSTChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      gstOption: value,
      gst: value === "Other" ? "" : value, // Reset GST if "Other" is selected
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Prepare the payload
      const payload = {
        name: formData.brandName,
        gst_rate: formData.gstOption === "Other" ? formData.gst : formData.gstOption, // Use custom GST if "Other" is selected
        available_prices: Object.keys(formData.pricing).filter(
          (key) => formData.pricing[key]
        ), // Include only selected pricing options
      };
  
      // Make POST request to the backend
      const response = await axios.post(`${BACKEND_URL}/brand/add`, payload);
  
      alert("Brand added successfully!");
  
      // Navigate to the Brands List page
      onSave();
    } catch (error) {
      console.error("Error adding brand:", error?.response?.data?.message || error?.message);
      alert("Failed to add brand: "+error?.response?.data?.message || error?.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Brand</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">GST Rate</label>
            <select
              name="gstOption"
              value={formData.gstOption}
              onChange={handleGSTChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >              
              <option value="5%">5% (Saree)</option>
              <option value="10%">10% (Lehenga)</option>
              <option value="Other">Other</option>
            </select>
            {formData.gstOption === 'Other' && (
              <input
                type="number"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                placeholder="Enter GST Rate"
                className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Pricing</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="WSR"
                checked={formData.pricing.WSR}
                onChange={handleChange}
                className="mr-2 h-5 w-5"
              />
              <label className="mr-4">WSR</label>
              <input
                type="checkbox"
                name="CP"
                checked={formData.pricing.CP}
                onChange={handleChange}
                className="mr-2 h-5 w-5"
              />
              <label>CP</label>
            </div>
          </div>
          <p className="mb-5">
            Want to Add Catalog Also?{' '}
            <span
              onClick={() => navigate('/home/add-catalog')}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Add Catalog
            </span>
          </p>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-200 hover:text-black transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBrands;