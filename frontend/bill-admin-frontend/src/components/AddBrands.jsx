import React, { useState } from 'react';
import Sidebar from './Sidebar';

function AddBrands() {
  const [formData, setFormData] = useState({
    brandName: '',
    brandDetails: '',
    pricing: {
      WSR: false,
      CP: false,
    },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Brand Added:', formData);
  };

  return (
    <div className='flex flex-row h-screen'>
      <div className='w-[15%]'>
        <Sidebar />
      </div>
      <div className='w-[75%] flex items-center justify-center'>
        <div className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Brand</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Brand Name</label>
              <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Brand Details</label>
              <textarea name="brandDetails" value={formData.brandDetails} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Pricing</label>
              <div className="flex items-center">
                <input type="checkbox" name="WSR" checked={formData.pricing.WSR} onChange={handleChange} className="mr-2" />
                <label className="mr-4">WSR</label>
                <input type="checkbox" name="CP" checked={formData.pricing.CP} onChange={handleChange} className="mr-2" />
                <label>CP</label>
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-200 hover:text-black transition">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBrands;