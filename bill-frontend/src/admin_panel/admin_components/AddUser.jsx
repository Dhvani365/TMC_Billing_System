import React, { useState } from "react";
import { Button } from "../admin_components/ui/button";

export default function AddUser({ onSave, onCancel, editingUser }) {
  const [formData, setFormData] = useState(
    editingUser || { name: "", email: "", role: "User", status: "Active" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex items-center justify-center h-[100%] bg-gray-100">
      <div className="flex flex-col bg-white p-6 rounded-xl shadow-md w-[40%]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingUser ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="w-[30%] bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-900 transition">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
