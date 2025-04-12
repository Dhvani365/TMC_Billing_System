import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../admin_components/ui/table";
import { Button } from "../admin_components/ui/button";
import AddUser from "./AddUser";

const initialUsersData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Viewer", status: "Inactive" },
];

export default function ViewUsers() {
    const [usersData, setUsersData] = useState(initialUsersData);
    const [showAddUser, setShowAddUser] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});
    const searchInputRef = useRef(null);
  
    useEffect(() => {
      searchInputRef.current?.focus();
    }, []);
  
    const filteredUsers = usersData.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowSelect = (id) => {
      setSelectedRows((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((rowId) => rowId !== id)
          : [...prevSelected, id]
      );
    };
  
    const handleSelectAll = () => {
      if (selectedRows.length === usersData.length) {
        setSelectedRows([]);
      } else {
        setSelectedRows(usersData.map((user) => user.id));
      }
    };
  
    const handleEdit = (id) => {
      setEditingRow(id);
      const userToEdit = usersData.find((user) => user.id === id);
      setEditedData(userToEdit);
    };
  
    const handleSave = (id) => {
      setUsersData((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...editedData } : user
        )
      );
      setEditingRow(null);
    };
  
    const handleDelete = (id) => {
      setUsersData((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== id));
    };
  
    const handleInputChange = (e, field) => {
      setEditedData({ ...editedData, [field]: e.target.value });
    };
  
    return (
      <div className="flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Users List</h2>
          <div className="flex flex-row items-center gap-4">
            {!showAddUser && (
              <input
                type="text"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
            <Button
              className="bg-green-500 hover:bg-green-900 text-white"
              onClick={() => setShowAddUser(!showAddUser)}
            >
              {showAddUser ? "Back to List" : "+ Add User"}
            </Button>
          </div>
        </div>
  
        {showAddUser ? (
          <AddUser />
        ) : (
          <>
            {selectedRows.length > 0 && (
              <div className="flex gap-4 mb-4">
                {selectedRows.length === 1 && (
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => handleEdit(selectedRows[0])}
                  >
                    Edit Selected User
                  </Button>
                )}
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDelete(selectedRows[0])}
                >
                  Delete Selected User
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
                      checked={selectedRows.length === usersData.length}
                      className="w-4 h-4"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={selectedRows.includes(user.id) ? "bg-gray-100" : ""}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => handleRowSelect(user.id)}
                        className="w-4 h-4"
                      />
                    </TableCell>
                    {editingRow === user.id ? (
                      <>
                        <TableCell>{user.id}</TableCell>
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
                            value={editedData.email}
                            onChange={(e) => handleInputChange(e, "email")}
                            className="border rounded p-1"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={editedData.role}
                            onChange={(e) => handleInputChange(e, "role")}
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
                            onClick={() => handleSave(user.id)}
                          >
                            Save
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.status}</TableCell>
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