import React, { useState, useRef, useEffect } from "react";
import { Button } from "../admin_components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../admin_components/ui/table";
import axios from "axios"; // Import axios for API requests
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [combinedData, setCombinedData] = useState([]); // Store combined party and brand data
  const [editingRowId, setEditingRowId] = useState(null); // Track the row being edited
  const [editedRowData, setEditedRowData] = useState({}); // Store the edited row data

  const searchInputRef = useRef(null); // Ref for the search bar
  // Fetch data from the API when the component loads
  useEffect(() => {
    const fetchPartiesAndBrands = async () => {
      try {
        // Fetch all parties
        const partyResponse = await axios.get(`${BACKEND_URL}/party`);
        const partiesData = partyResponse.data;
    
        // Fetch brands for each party using their IDs
        const brandRequests = partiesData.map((party) =>
          axios.get(`${BACKEND_URL}/party/${party._id}`)
        );
    
        const brandResponses = await Promise.all(brandRequests);
    
        console.log(brandResponses); // Log the brand responses for debugging
    
        // Combine parties with their respective brands
        const combined = brandResponses.map((res) => ({
          ...res.data.party, // Party data
          brands: res.data.relations.map((relation) => ({
            ...relation.brand, // Brand data
            default_price: relation.default_price,
            discount: relation.discount,
            relation_id: relation.id, // Map the id field to relation_id
          })),
        }));
    
        setCombinedData(combined); // Update state with combined data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parties or brands data:", error);
        setLoading(false);
      }
    };

    fetchPartiesAndBrands();
    searchInputRef.current?.focus();
  }, [editingRowId, editedRowData]);

  if (loading) {
    return <p>Loading Parties...</p>;
  }

  const filteredParties = combinedData.filter((party) =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === combinedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(combinedData.map((party) => party._id));
    }
  };

  const handleExportParties = () => {
    const exportedData = combinedData.filter((party) => selectedRows.includes(party._id));
    console.log("Exported Parties Data:", exportedData);
    alert("Exported Parties data has been logged to the console.");
  };

  const handleUpdateParty = () => {
    if (selectedRows.length === 1) {
      const partyId = selectedRows[0];
      setEditingRowId(partyId); // Set the row to be edited
      const partyToEdit = combinedData.find((party) => party._id === partyId);
      setEditedRowData(partyToEdit); // Initialize the editable data
    } else {
      alert("Please select exactly one party to update.");
    }
  };

  const handleSaveParty = async () => {
    try {
      // Prepare data for the API call
      const { name, gst_no, address, preferred_courier, brands } = editedRowData;
  
      // Map the brands array to include relation_id
      const list_of_selected_brands = brands.map((brand) => ({
        relation_id: brand.relation_id, // Pass the relation_id
        brand_id: brand._id,
        pricing_type: brand.default_price,
        discount: brand.discount,
      }));
  
      console.log("Payload being sent:", {
        name,
        gst_no,
        address,
        preferred_courier,
        list_of_selected_brands,
      });
  
      // Make API call to update the party
      const response = await axios.put(`${BACKEND_URL}/party/update/${editingRowId}`, {
        name,
        gst_no,
        address,
        preferred_courier,
        list_of_selected_brands,
      });
  
      // Update the state with the response data
      const updatedParty = response.data;
      const updatedData = combinedData.map((party) =>
        party._id === editingRowId ? { ...party, ...updatedParty } : party
      );
      setCombinedData(updatedData);
  
      // Exit edit mode
      setEditingRowId(null);
      setSelectedRows([]);
      alert("Party updated successfully!");
    } catch (error) {
      console.error("Error updating party:", error.response?.data || error.message);
      alert("Failed to update party. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null); // Exit edit mode
    setEditedRowData({}); // Clear edited data
  };

  const handleFieldChange = (field, value) => {
    setEditedRowData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDeleteParty = async () => {
    try {
      // Confirm deletion
      if (!window.confirm("Are you sure you want to delete the selected parties?")) {
        return;
      }

      // Make DELETE requests for each selected party
      for (const partyId of selectedRows) {
        await axios.delete(`${BACKEND_URL}/party/delete/${partyId}`);
      }

      // Remove deleted parties from the state
      const remainingParties = combinedData.filter((party) => !selectedRows.includes(party._id));
      setCombinedData(remainingParties);
      setSelectedRows([]);
      alert("Selected parties have been deleted successfully!");
    } catch (error) {
      console.error("Error deleting parties:", error.response?.data || error.message);
      alert("Failed to delete parties. Please try again.");
    }
  };

  const handleBrandFieldChange = (brandIndex, field, value) => {
    setEditedRowData((prevData) => {
      const updatedBrands = [...prevData.brands];
      updatedBrands[brandIndex] = {
        ...updatedBrands[brandIndex],
        [field]: value,
      };
      return {
        ...prevData,
        brands: updatedBrands,
      };
    });
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parties</h1>
        <div className="flex flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search Parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={searchInputRef}
            className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button
            className="bg-green-500 text-white py-2 rounded-md font-semibold mt-2 hover:bg-green-900"
            onClick={() => navigate("/home/add-party")}
          >
            + Add Party
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex gap-4 mb-4">
          <Button
            className="bg-green-500 hover:bg-green-700 text-white"
            onClick={handleExportParties}
          >
            Export Parties Data
          </Button>
          {selectedRows.length === 1 && (
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleUpdateParty}
            >
              Edit Party data
            </Button>
          )}
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDeleteParty}
          >
            Delete Party/Parties
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
                checked={selectedRows.length === combinedData.length}
                className="w-4 h-4"
              />
            </TableHead>
            <TableHead>Party Name</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Preferred Courier</TableHead>
            <TableHead>Brands</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParties.map((party) => (
            <TableRow key={party._id} className={selectedRows.includes(party._id) ? "bg-gray-100" : ""}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(party._id)}
                  onChange={() => handleRowSelect(party._id)}
                  className="w-4 h-4"
                />
              </TableCell>
              <TableCell>
                {editingRowId === party._id ? (
                  <input
                    type="text"
                    value={editedRowData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="border rounded p-1"
                  />
                ) : (
                  party.name
                )}
              </TableCell>
              <TableCell>
                {editingRowId === party._id ? (
                  <input
                    type="text"
                    value={editedRowData.gst_no || ""}
                    onChange={(e) => handleFieldChange("gst_no", e.target.value)}
                    className="border rounded p-1"
                  />
                ) : (
                  party.gst_no
                )}
              </TableCell>
              <TableCell>
                {editingRowId === party._id ? (
                  <input
                    type="text"
                    value={editedRowData.address || ""}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    className="border rounded p-1"
                  />
                ) : (
                  party.address
                )}
              </TableCell>
              <TableCell>
                {editingRowId === party._id ? (
                  <input
                  type="text"
                  value={editedRowData.preferred_courier || ""}
                  onChange={(e) => handleFieldChange("preferred_courier", e.target.value)}
                  className="border rounded p-1"
                />
                ) : (
                  party.preferred_courier
                )}
              </TableCell>
              <TableCell>
              <div className="flex flex-row gap-1">
                <div className="flex flex-col gap-4">
                  {party.brands.map((brand, index) => (
                    <div key={`${party._id}-${brand._id}-${index}`} className="flex gap-2 items-center">
                      {editingRowId === party._id ? (
                        <>
                          <strong>{brand.name}</strong> 
                          <input
                            type="text"
                            value={editedRowData.brands[index]?.default_price || ""}
                            onChange={(e) =>
                              handleBrandFieldChange(index, "default_price", e.target.value)
                            }
                            className="border rounded p-1 w-20"
                            placeholder="Default Price"
                          />
                          <input
                            type="number"
                            value={editedRowData.brands[index]?.discount || ""}
                            onChange={(e) =>
                              handleBrandFieldChange(index, "discount", e.target.value)
                            }
                            className="border rounded p-1 w-16"
                            placeholder="Discount"
                          />
                        </>
                      ) : (
                        <span>
                          <strong>{brand.name}</strong> (Default Price: {brand.default_price}, Discount: {brand.discount}%)
                        </span>
                      )}
                    
                    </div>
                    ))}                
                </div>
                    {editingRowId === party._id ? (
                      <>
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white mr-2"
                          onClick={handleSaveParty}
                        >
                          Save
                        </Button>
                        <Button
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                    </>
                  ) : null}
              </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HomePage;