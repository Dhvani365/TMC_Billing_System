import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../components/ui/table";
import axios from "axios"; // Import axios for API requests

function HomePage() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parties, setParties] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Fetch data from the API when the component loads
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/party");
        console.log("Fetched Parties Data:", response.data); // Log the fetched data
        setParties(response.data); // Update the state with the fetched data

        // Fetch brand names for all parties
        const brandRequests = response.data.flatMap((party) =>
          party.selected_brands.map((brandId) =>
            axios.get(`http://localhost:3000/api/brand/${brandId}`)
          )
        );

        const brandResponses = await Promise.all(brandRequests);
        const brandData = brandResponses.map((res) => res.data);
        console.log("Fetched Brand Data:", brandData); // Log the fetched brand data
      } catch (error) {
        console.error("Error fetching parties or brands data:", error);
      }
    };

    fetchParties();
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
              <TableCell>{party.name}</TableCell>
              <TableCell>{party.gst_no}</TableCell>
              <TableCell>{party.address}</TableCell>
              <TableCell>{party.preferred_courier}</TableCell>
              <TableCell>{party.wsr_discount}%</TableCell>
              <TableCell>{party.cp_discount}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HomePage;