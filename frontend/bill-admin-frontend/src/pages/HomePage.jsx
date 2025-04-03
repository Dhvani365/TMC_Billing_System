import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../components/ui/table";

const partiesData = [
  { id: 1, name: "Alpha Traders", gst: "GST1234", address: "123 Street, City", courier: "DHL", wsr_discount: 5, cp_discount: 10 },
  { id: 2, name: "Beta Distributors", gst: "GST5678", address: "456 Avenue, Town", courier: "FedEx", wsr_discount: 8, cp_discount: 12 },
  { id: 3, name: "Gamma Suppliers", gst: "GST9101", address: "789 Road, Village", courier: "UPS", wsr_discount: 6, cp_discount: 15 }
];

function HomePage() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parties, setParties] = useState(partiesData);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filteredParties = parties.filter((party) =>
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
    if (selectedRows.length === parties.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(parties.map((party) => party.id));
    }
  };

  const handleExportParties = () => {
    const exportedData = parties.filter((party) => selectedRows.includes(party.id));
    console.log("Exported Parties Data:", exportedData);
    alert("Exported Parties data has been logged to the console.");
  };

  const handleEdit = (id) => {
    setEditingRow(id);
    const partyToEdit = parties.find((party) => party.id === id);
    setEditedData(partyToEdit);
  };

  const handleSave = (id) => {
    setParties((prevParties) =>
      prevParties.map((party) =>
        party.id === id ? { ...party, ...editedData } : party
      )
    );
    setEditingRow(null);
  };

  const handleDelete = (id) => {
    setParties((prevParties) => prevParties.filter((party) => party.id !== id));
    setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== id));
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
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
            onClick={() => navigate('/add-client')}
          >
            + Add Party
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex gap-4 mb-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleExportParties}
          >
            Export Selected Parties
          </Button>
          {selectedRows.length === 1 && (
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => handleEdit(selectedRows[0])}
            >
              Edit Selected Party
            </Button>
          )}
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => handleDelete(selectedRows[0])}
          >
            Delete Selected Party
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
                checked={selectedRows.length === parties.length}
                className="w-4 h-4"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Party Name</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Courier Service</TableHead>
            <TableHead>WSR Discount (%)</TableHead>
            <TableHead>CP Discount (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParties.map((party) => (
            <TableRow key={party.id} className={selectedRows.includes(party.id) ? "bg-gray-100" : ""}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(party.id)}
                  onChange={() => handleRowSelect(party.id)}
                  className="w-4 h-4"
                />
              </TableCell>
              {editingRow === party.id ? (
                <>
                  <TableCell>{party.id}</TableCell>
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
                      value={editedData.gst}
                      onChange={(e) => handleInputChange(e, "gst")}
                      className="border rounded p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={editedData.address}
                      onChange={(e) => handleInputChange(e, "address")}
                      className="border rounded p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={editedData.courier}
                      onChange={(e) => handleInputChange(e, "courier")}
                      className="border rounded p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={editedData.wsr_discount}
                      onChange={(e) => handleInputChange(e, "wsr_discount")}
                      className="border rounded p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={editedData.cp_discount}
                      onChange={(e) => handleInputChange(e, "cp_discount")}
                      className="border rounded p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleSave(party.id)}
                    >
                      Save
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{party.id}</TableCell>
                  <TableCell>{party.name}</TableCell>
                  <TableCell>{party.gst}</TableCell>
                  <TableCell>{party.address}</TableCell>
                  <TableCell>{party.courier}</TableCell>
                  <TableCell>{party.wsr_discount}%</TableCell>
                  <TableCell>{party.cp_discount}%</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HomePage;