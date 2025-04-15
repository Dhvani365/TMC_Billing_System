import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../admin_components/ui/table";
import { Button } from "../admin_components/ui/button";
import PartyDiscount from "./AddPartyDiscount";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SpecialDiscountList() {
  const [discountsData, setDiscountsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]); // For filtered data
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editedData, setEditedData] = useState({}); // Store edited data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(""); // Track error state
  const searchRef = useRef();

  useEffect(()=>{
    if (!showAddDiscount && !editingRow && searchRef.current) {
      searchRef.current.focus(); // Focus the search bar when switching back to the brand list
    }
  })
  // Fetch discounts from the backend
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/specialdiscount`, {
          withCredentials: true,
        });
        console.log(response.data);
        setDiscountsData(response.data);
        setFilteredDiscounts(response.data); // Initialize filtered data
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch special discounts");
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [showAddDiscount]);

  // Log filtered discounts before rendering
  // console.log("Filtered Discounts:", filteredDiscounts);
  // Handle individual row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle "Select All" checkbox
  // Ensure handleSelectAll works with filteredDiscounts
  const handleSelectAll = () => {
    if (selectedRows.length === filteredDiscounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredDiscounts.map((discount) => discount._id));
    }
  };

  // Handle exporting selected rows
  const handleExportData = () => {
    const exportedData = discountsData.filter((discount) => selectedRows.includes(discount._id));
    console.log("Exported Discounts Data:", exportedData);
    alert("Exported Discounts data has been logged to the console.");
  };

  // Handle deleting a discount
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/specialdiscount/delete/${id}`, {
        withCredentials: true,
      });
      setFilteredDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount._id !== id));
      setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== id));
      alert("Discount deleted successfully!");
    } catch (err) {
      alert("Failed to delete discount. Please try again.");
    }
  };

  // Handle toggling discount status
  const handleToggleStatus = async (id) => {
    // Find the discount to toggle from the filteredDiscounts (which reflects the latest state)
    const discountToToggle = filteredDiscounts.find((discount) => discount._id === id);
  
    if (!discountToToggle) {
      alert("Discount not found.");
      return;
    }
  
    try {
      // Prepare the updated discount object with the latest values
      const updatedDiscount = {
        ...discountToToggle,
        status: !discountToToggle.status, // Toggle the status
      };
  
      // Send the updated discount to the backend
      await axios.put(`${BACKEND_URL}/specialdiscount/update/${id}`, updatedDiscount, {
        withCredentials: true,
      });
  
      // Update the state with the toggled status
      setFilteredDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount._id === id ? { ...discount, status: updatedDiscount.status } : discount
        )
      );
  
      // Also update the original discountsData to keep it in sync
      setDiscountsData((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount._id === id ? { ...discount, status: updatedDiscount.status } : discount
        )
      );
  
      // alert("Discount status updated successfully!");
    } catch (err) {
      alert("Failed to update discount status. Please try again.");
    }
  };

  // Handle editing a discount
  const handleEdit = (id) => {
    setEditingRow(id);
    const discountToEdit = discountsData.find((discount) => discount._id === id);
    setEditedData(discountToEdit);
  };

  // Handle saving edited discount data
  const handleSave = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/specialdiscount/update/${id}`, editedData, {
        withCredentials: true,
      });
  
      // Update both filteredDiscounts and discountsData with the edited data
      setFilteredDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount._id === id ? { ...discount, ...editedData } : discount
        )
      );
      setDiscountsData((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount._id === id ? { ...discount, ...editedData } : discount
        )
      );
  
      setEditingRow(null);
      alert("Discount updated successfully!");
    } catch (err) {
      alert("Failed to update discount. Please try again.");
    }
  };

  // Handle input change for editing
  const handleInputChange = (e, field) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

    // Handle search input change
    const handleSearchChange = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
  
      // Filter discounts based on the search query
      const filtered = discountsData.filter((discount) => {
        const brandName = discount.brand_id?.name?.toLowerCase() || "";
        const catalogName = discount.catalog_id?.name?.toLowerCase() || "";
        const partyName = discount.party_id?.name?.toLowerCase() || "";
        return (
          brandName.includes(query) ||
          catalogName.includes(query) ||
          partyName.includes(query)
        );
      });
      setFilteredDiscounts(filtered);
    };

  if (loading) {
    return <p>Loading special discounts...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Special Discount List</h2>
        {/* Search Bar */}
        <div className="flex flex-row items-center gap-4">
          {!showAddDiscount && (
            <div>
              <input
                type="text"
                placeholder="Search by Brand, Catalog, or Party"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ref={searchRef}
              />
            </div>
          )}
          <Button
            className="bg-green-500 hover:bg-green-900 text-white"
            onClick={() => setShowAddDiscount(!showAddDiscount)}            
          >
            {showAddDiscount ? "Back to List" : "+ Add Special Discount"}
          </Button>
        </div>
          
      </div>

      {/* Show Add Discount Form OR Table */}
      {showAddDiscount ? (
        <PartyDiscount 
          onSaveSuccess={() => {
            setShowAddDiscount(false); // Set showAddDiscount to false after successful save
          }}
        />
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
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDelete(selectedRows[0])}
              >
                Delete Selected Discount
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
                    checked={selectedRows.length > 0 && selectedRows.length === filteredDiscounts.length}
                    className="w-4 h-4"
                  />
                </TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>Catalog Name</TableHead>
                <TableHead>Party Name</TableHead>
                <TableHead>Pricing Type</TableHead>
                <TableHead>Discount Rate (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiscounts.map((discount) => (
                <TableRow key={discount._id} className={selectedRows.includes(discount._id) ? "bg-gray-100" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(discount._id)}
                      onChange={() => handleRowSelect(discount._id)}
                      className="w-4 h-4"
                    />
                  </TableCell>
                  <TableCell>
                    {editingRow === discount._id ? (
                      <input
                        type="text"
                        value={editedData.brand_id?.name || ""}
                        onChange={(e) => handleInputChange(e, "brand_id")}
                        className="border border-gray-300 rounded p-1 w-[100%]"
                      />
                    ) : (
                      discount.brand_id?.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount._id ? (
                      <input
                        type="text"
                        value={editedData.catalog_id?.name || ""}
                        onChange={(e) => handleInputChange(e, "catalog_id")}
                        className="border border-gray-300 rounded p-1 w-[100%]"
                      />
                    ) : (
                      discount.catalog_id?.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount._id ? (
                      <input
                        type="text"
                        value={editedData.party_id?.name || ""}
                        onChange={(e) => handleInputChange(e, "party_id")}
                        className="border border-gray-300 rounded p-1 w-[100%]"
                      />
                    ) : (
                      discount.party_id?.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount._id ? (
                      <input
                        type="text"
                        value={editedData.price_type || ""}
                        onChange={(e) => handleInputChange(e, "price_type")}
                        className="border border-gray-300 rounded p-1 w-[50%]"
                      />
                    ) : (
                      discount.price_type
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount._id ? (
                      <input
                        type="number"
                        value={editedData.discount || ""}
                        onChange={(e) => handleInputChange(e, "discount")}
                        className="border border-gray-300 rounded p-1 w-[50%]"
                      />
                    ) : (
                      discount.discount
                    )}
                  </TableCell>
                  <TableCell>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={discount.status}
                        onChange={() => handleToggleStatus(discount._id)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-14 h-7 py-0.5 rounded-full transition-colors duration-300 ${
                          discount.status ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            discount.status ? "translate-x-7" : "translate-x-1"
                          }`}
                        ></div>
                      </div>
                    </label>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      {editingRow === discount._id ? (
                        <Button
                          className="bg-green-700 hover:bg-green-900 text-white mx-2"
                          onClick={() => handleSave(discount._id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white mx-2"
                          onClick={() => handleEdit(discount._id)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleDelete(discount._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}