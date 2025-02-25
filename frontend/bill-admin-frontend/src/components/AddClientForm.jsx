import React, {useState} from 'react'
import Sidebar from "./Sidebar";

function AddClientForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gst: '',
    courier: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client Added:', formData);
  };
  return (
    <div className='flex flex-row h-screen'>
        <div className='w-[15%]'>
            <Sidebar/>
        </div>
        <div className='w-[75%] flex items-center justify-center'>
          <div className="flex flex-col mx-[20%] bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Client</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full h-[100%] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">GST Number</label>
                <input type="text" name="gst" value={formData.gst} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Preferred courier</label>
                <input type="text" name="pref-courier" value={formData.courier} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-200 hover:text-black transition">Submit</button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default AddClientForm
