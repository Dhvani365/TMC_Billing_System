import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddClientForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    // phone: "",
    address: "",
    gst: "",
    courier: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/add-pricing", { state: { clientData: formData } });
  };

  return (
    <div className="flex items-center justify-center h-[100%] bg-gray-100">
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-md w-[40%]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full h-[50px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">GST Number</label>
            <input
              type="text"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Preferred Courier</label>
            <input
              type="text"
              name="courier"
              value={formData.courier}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClientForm;