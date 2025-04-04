import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PartyDiscount from "./PartyDiscount";

const initialDiscountsData = [
  {
    id: 1,
    brandName: "Nike",
    catalogName: "Sportswear",
    partyName: "Retailer A",
    pricingType: "WSR",
    discountRate: 10,
    isActive: true,
  },
  {
    id: 2,
    brandName: "Apple",
    catalogName: "Technology",
    partyName: "Retailer B",
    pricingType: "CP",
    discountRate: 15,
    isActive: false,
  },
  {
    id: 3,
    brandName: "Samsung",
    catalogName: "Electronics",
    partyName: "Retailer C",
    pricingType: "Both",
    discountRate: 20,
    isActive: true,
  },
];

export default function SpecialDiscountList() {
  const [discountsData, setDiscountsData] = useState(initialDiscountsData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editedData, setEditedData] = useState({}); // Store edited data

  // Handle individual row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedRows.length === discountsData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(discountsData.map((discount) => discount.id));
    }
  };

  // Handle exporting selected rows
  const handleExportData = () => {
    const exportedData = discountsData.filter((discount) => selectedRows.includes(discount.id));
    console.log("Exported Discounts Data:", exportedData);
    alert("Exported Discounts data has been logged to the console.");
  };

  // Handle deleting a discount
  const handleDelete = (id) => {
    setDiscountsData((prevDiscounts) => prevDiscounts.filter((discount) => discount.id !== id));
    setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== id));
  };

  // Handle toggling discount status
  const handleToggleStatus = (id) => {
    setDiscountsData((prevDiscounts) =>
      prevDiscounts.map((discount) =>
        discount.id === id ? { ...discount, isActive: !discount.isActive } : discount
      )
    );
  };

  // Handle editing a discount
  const handleEdit = (id) => {
    setEditingRow(id);
    const discountToEdit = discountsData.find((discount) => discount.id === id);
    setEditedData(discountToEdit);
  };

  // Handle saving edited discount data
  const handleSave = (id) => {
    setDiscountsData((prevDiscounts) =>
      prevDiscounts.map((discount) =>
        discount.id === id ? { ...discount, ...editedData } : discount
      )
    );
    setEditingRow(null);
  };

  // Handle input change for editing
  const handleInputChange = (e, field) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Special Discount List</h2>
        <Button
          className="bg-green-500 hover:bg-green-900 text-white"
          onClick={() => setShowAddDiscount(!showAddDiscount)}
        >
          {showAddDiscount ? "Back to List" : "+ Add Special Discount"}
        </Button>
      </div>

      {/* Show Add Discount Form OR Table */}
      {showAddDiscount ? (
        <PartyDiscount />
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
                    checked={selectedRows.length === discountsData.length}
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
              {discountsData.map((discount) => (
                <TableRow key={discount.id} className={selectedRows.includes(discount.id) ? "bg-gray-100" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(discount.id)}
                      onChange={() => handleRowSelect(discount.id)}
                      className="w-4 h-4"
                    />
                  </TableCell>
                  <TableCell>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        value={editedData.brandName}
                        onChange={(e) => handleInputChange(e, "brandName")}
                        className="border border-gray-300 rounded p-1 w-[80%]"
                      />
                    ) : (
                      discount.brandName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        value={editedData.catalogName}
                        onChange={(e) => handleInputChange(e, "catalogName")}
                        className="border border-gray-300 rounded p-1 w-[80%]"
                      />
                    ) : (
                      discount.catalogName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        value={editedData.partyName}
                        onChange={(e) => handleInputChange(e, "partyName")}
                        className="border border-gray-300 rounded p-1 w-[80%]"
                      />
                    ) : (
                      discount.partyName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        value={editedData.pricingType}
                        onChange={(e) => handleInputChange(e, "pricingType")}
                        className="border border-gray-300 rounded p-1 w-[80%]"
                      />
                    ) : (
                      discount.pricingType
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === discount.id ? (
                      <input
                        type="number"
                        value={editedData.discountRate}
                        onChange={(e) => handleInputChange(e, "discountRate")}
                        className="border border-gray-300 rounded p-1 w-[80%]"
                      />
                    ) : (
                      discount.discountRate
                    )}
                  </TableCell>
                  <TableCell>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        checked={discount.isActive}
                        onChange={() => handleToggleStatus(discount.id)}
                        className="sr-only peer"
                        />
                        <div
                        className={`w-14 h-7 py-0.5 rounded-full transition-colors duration-300 ${
                            discount.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                        >
                        <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            discount.isActive ? "translate-x-7" : "translate-x-1"
                            }`}
                        ></div>
                        </div>
                    </label>
                    </TableCell>
                  <TableCell>
                    {editingRow === discount.id ? (
                      <Button
                        className="bg-green-700 hover:bg-green-900 text-white mx-2"
                        onClick={() => handleSave(discount.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white mx-2"
                        onClick={() => handleEdit(discount.id)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleDelete(discount.id)}
                    >
                      Delete
                    </Button>
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