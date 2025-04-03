import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddBrands from "./AddBrands";

const initialBrandsData = [
  { id: 1, name: "Nike", category: "Sportswear", status: "Active" },
  { id: 2, name: "Apple", category: "Technology", status: "Active" },
  { id: 3, name: "Samsung", category: "Electronics", status: "Inactive" },
];

export default function BrandsList() {
  const [brandsData, setBrandsData] = useState(initialBrandsData);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editedData, setEditedData] = useState({}); // Store edited data
  const searchInputRef = useRef(null); // Ref for the search bar

  // Focus on the search bar when the component mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

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
    const brandToEdit = brandsData.find((brand) => brand.id === id);
    setEditedData(brandToEdit);
  };

  // Handle saving edited brand data
  const handleSave = (id) => {
    setBrandsData((prevBrands) =>
      prevBrands.map((brand) =>
        brand.id === id ? { ...brand, ...editedData } : brand
      )
    );
    setEditingRow(null);
  };

  // Handle deleting a brand
  const handleDelete = (id) => {
    setBrandsData((prevBrands) => prevBrands.filter((brand) => brand.id !== id));
    setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== id));
  };

  // Handle input change for editing
  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
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
                <TableHead>ID</TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id} className={selectedRows.includes(brand.id) ? "bg-gray-100" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(brand.id)}
                      onChange={() => handleRowSelect(brand.id)}
                      className="w-4 h-4"
                    />
                  </TableCell>
                  {editingRow === brand.id ? (
                    <>
                      <TableCell>{brand.id}</TableCell>
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
                          type="text"
                          value={editedData.category}
                          onChange={(e) => handleInputChange(e, "category")}
                          className="border rounded p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={editedData.status}
                          onChange={(e) => handleInputChange(e, "status")}
                          className="border rounded p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleSave(brand.id)}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{brand.id}</TableCell>
                      <TableCell>{brand.name}</TableCell>
                      <TableCell>{brand.category}</TableCell>
                      <TableCell>{brand.status}</TableCell>
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