import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../admin_components/ui/table";
import { Button } from "../admin_components/ui/button";
import AddBrands from "./AddBrands";
import axios from 'axios';

// const initialBrandsData = [
//   { id: 1, name: "Nike", category: "Sportswear", status: "Active" },
//   { id: 2, name: "Apple", category: "Technology", status: "Active" },
//   { id: 3, name: "Samsung", category: "Electronics", status: "Inactive" },
// ];

export default function BrandsList() {
  const [brandsData, setBrandsData] = useState(null);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editedData, setEditedData] = useState({}); // Store edited data
  const searchInputRef = useRef(null); // Ref for the search bar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showAddBrand && !editingRow && searchInputRef.current) {
      searchInputRef.current.focus(); // Focus the search bar when switching back to the brand list
    }
  });

  // Focus on the search bar when the component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/brand");
        console.log(response.data);
        setBrandsData(response.data); // Store the fetched brands in state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brands:", err.response?.data || err.message);
        setError("Failed to fetch brands. Please try again.");
        setLoading(false);
      }
    };

    fetchBrands();
    searchInputRef.current?.focus();
  }, []);

  if (loading) {
    return <p>Loading brands...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Filter brands based on search term
  const filteredBrands = brandsData.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle individual row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id) // Unselect if already selected
        : [...prevSelected, id] // Select the row
    );
  };

  const handleCancelEdit = () => {
    setEditingRow(null); // Exit edit mode
    setEditedData({}); // Clear edited data
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedRows.length === brandsData.length) {
      setSelectedRows([]); // Unselect all
    } else {
      setSelectedRows(brandsData.map((brand) => brand.id)); // Select all
    }
  };

  // Handle exporting selected rows
  const handleExportData = () => {
    const exportedData = brandsData.filter((brand) => selectedRows.includes(brand.id));
    console.log("Exported Brands Data:", exportedData);
    alert("Exported Brands data has been logged to the console.");
  };

  // Handle editing a brand
  const handleEdit = (id) => {
    setEditingRow(id);
    const brandToEdit = brandsData.find((brand) => brand._id === id);
    setEditedData(brandToEdit);
  };

  // Handle saving edited brand data
  const handleUpdate = async (id) => {
    try {
      // Prepare the payload with the edited data
      const payload = {
        name: editedData.name,
        gst_rate: editedData.gst_rate,
        available_prices: Array.isArray(editedData.available_prices)
          ? editedData.available_prices // Use as-is if it's already an array
          : editedData.available_prices.split(",").map((price) => price.trim()), // Convert string to array
      };
  
      console.log("Payload being sent:", payload);
  
      // Make PUT request to the backend
      const response = await axios.put(`http://localhost:3000/api/brand/update/${id}`, payload);
  
      alert("Brand updated successfully!");
  
      // Update the brandsData state with the updated brand
      setBrandsData((prevBrands) =>
        prevBrands.map((brand) =>
          brand._id === id ? { ...brand, ...payload } : brand
        )
      );
  
      // Exit edit mode
      setEditingRow(null);
      setEditedData({});
    } catch (error) {
      console.error("Error updating brand:", error.response?.data || error.message);
      alert("Failed to update brand. Please try again.");
    }
  };

  // Handle deleting a brand
  const handleDelete = async (id) => {
    try {
      // Make DELETE request to the backend
      const response = await axios.delete(`http://localhost:3000/api/brand/delete/${id}`);
      alert("Brand deleted successfully!");
      console.log("Response from backend:", response.data);
  
      // Update the brandsData state to remove the deleted brand
      setBrandsData((prevBrands) => prevBrands.filter((brand) => brand._id !== id));
  
      // Update the selectedRows state to remove the deleted brand's ID
      setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== id));
    } catch (error) {
      console.error("Error deleting brand:", error.response?.data || error.message);
      alert("Failed to delete brand. Please try again.");
    }
  };

  // Handle input change for editing
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setEditedData({
      ...editedData,
      [field]: field === "available_prices" ? value.split(",").map((v) => v.trim()) : value, // Convert string to array for available_prices
    });
  };

  return (
    <div className="flex flex-col p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Brands List</h2>

        {/* Search Bar */}
        <div className="flex flex-row items-center gap-4">
          {!showAddBrand && <input
            type="text"
            placeholder="Search Brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={searchInputRef} // Attach ref to the search bar
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />}
          
          <Button
            className="bg-green-500 hover:bg-green-900 text-white"
            onClick={() => setShowAddBrand(!showAddBrand)}
          >
            {showAddBrand ? "Back to List" : "+ Add Brand"}
          </Button>
        </div>
      </div>

      {/* Show Add Brand Form OR Table */}
      {showAddBrand ? (
        <AddBrands />
      ) : (
        <>
          {selectedRows.length > 0 && (
            <div className="flex gap-4 mb-4">
              <Button
                className="bg-green-500 hover:bg-green-900 text-white"
                onClick={handleExportData}
              >
                Export Selected Data
              </Button>
              {selectedRows.length === 1 && (
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => handleEdit(selectedRows[0])}
                >
                  Edit Selected Brand
                </Button>
              )}
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDelete(selectedRows[0])}
              >
                Delete Selected Brand
              </Button>
            </div>
          )}
          <Table className="border border-gray-200 rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === brandsData.length}
                    className="w-4 h-4"
                  />
                </TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>GST Rate</TableHead>
                <TableHead>Available Pricings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand._id} className={selectedRows.includes(brand._id) ? "bg-gray-100" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(brand._id)}
                      onChange={() => handleRowSelect(brand._id)}
                      className="w-4 h-4"
                    />
                  </TableCell>
                  {editingRow === brand._id ? (
                    <>
                      <TableCell>
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => handleInputChange(e, "name")}
                          className="border rounded p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="test"
                          value={editedData.gst_rate}
                          onChange={(e) => handleInputChange(e, "gst_rate")}
                          className="border rounded p-1"
                        />
                      </TableCell>
                      <TableCell>
                      <input
                        type="text"
                        value={Array.isArray(editedData.available_prices) ? editedData.available_prices.join(", ") : ""} // Ensure it's a string
                        onChange={(e) => handleInputChange(e, "available_prices")}
                        className="border rounded p-1"
                      />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">                        
                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleUpdate(brand._id)}
                          >
                            Save
                          </Button>
                          <Button
                              className="bg-gray-500 hover:bg-gray-600 text-white"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{brand.name}</TableCell>
                      <TableCell>{brand.gst_rate}</TableCell>
                      <TableCell>{brand.available_prices?.join(", ") || "N/A"}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}