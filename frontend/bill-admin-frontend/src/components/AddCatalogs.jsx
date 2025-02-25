import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function AddCatalogs() {
  const [formData, setFormData] = useState({
    brandName: '',
    catalogName: '',
    numberOfSKUs: 0,
    allSKUSamePrice: false,
    gstRate: '',
    skus: [],
  });

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Fetch brands from the database
    setBrands(['Brand1', 'Brand2']);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
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
    const numberOfSKUs = parseInt(e.target.value, 10);
    const skus = Array.from({ length: numberOfSKUs }, (_, index) => ({
      skuCode: `SKU-${index + 1}`,
      image: '',
      cpPrice: '',
      wsrPrice: '',
    }));
    setFormData({ ...formData, numberOfSKUs, skus });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Catalog Added:', formData);
  };

  return (
    <div className='flex flex-row h-screen'>
      <div className='w-[15%]'>
        <Sidebar />
      </div>
      <div className='w-[85%] flex'>
        <div className='w-[33%] ml-[2%] flex items-center justify-center'>
          <div className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Catalog</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Brand Name</label>
                <select name="brandName" value={formData.brandName} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Catalog Name</label>
                <input type="text" name="catalogName" value={formData.catalogName} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Number of SKUs</label>
                <input type="number" name="numberOfSKUs" value={formData.numberOfSKUs} onChange={handleNumberOfSKUsChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                <div className="flex items-center mt-2">
                  <input type="checkbox" name="allSKUSamePrice" checked={formData.allSKUSamePrice} onChange={handleChange} className="mr-2" />
                  <label>All SKUs Same Price</label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">GST Rate (%)</label>
                <input type="number" name="gstRate" value={formData.gstRate} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-200 hover:text-black transition">Save</button>
            </form>
          </div>
        </div>
        <div className='w-[65%] p-6 overflow-y-auto'>
          <div className="grid grid-cols-3 gap-2">
            {formData.skus.map((sku, index) => (
              <div key={index} className="text-sm border p-3 rounded-md shadow-md bg-white">
                <h3 className="text-sm font-semibold mb-2">SKU {index + 1}</h3>
                <div className="mb-1 text-sm">
                  <label className="block text-gray-600 mb-1">SKU Code</label>
                  <input type="text" value={sku.skuCode} onChange={(e) => handleSKUsChange(index, 'skuCode', e.target.value)} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div className="mb-1 text-sm">
                  <label className="block text-gray-600 mb-1">Image</label>
                  <input type="file" value={sku.image} onChange={(e) => handleSKUsChange(index, 'image', e.target.value)} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div className="mb-1 text-sm">
                  <label className="block text-gray-600 mb-1">CP Price</label>
                  <input type="number" value={sku.cpPrice} onChange={(e) => handleSKUsChange(index, 'cpPrice', e.target.value)} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div className="mb-1 text-sm">
                  <label className="block text-gray-600 mb-1">WSR Price</label>
                  <input type="number" value={sku.wsrPrice} onChange={(e) => handleSKUsChange(index, 'wsrPrice', e.target.value)} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCatalogs;