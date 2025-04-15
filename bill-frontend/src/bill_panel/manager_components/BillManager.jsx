import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { format } from "date-fns";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BillManager = ({ isOpen, onClose, clients }) => {
  const dispatch = useDispatch();
  const [savedBills, setSavedBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    party: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });

  // Fetch all bills when bill manager modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBills();
    }
  }, [isOpen]);

  // Filter bills when filter options change
  useEffect(() => {
    if (savedBills.length > 0) {
      filterBills();
    }
  }, [filterOptions, savedBills]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/bill`, {
        withCredentials: true,
      });
      setSavedBills(response.data);
      setFilteredBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBills = () => {
    let filtered = [...savedBills];

    // Filter by party
    if (filterOptions.party) {
      filtered = filtered.filter(bill => 
        bill.party.name.toLowerCase().includes(filterOptions.party.toLowerCase()) ||
        bill.partyId === filterOptions.party
      );
    }

    // Filter by date range
    if (filterOptions.startDate) {
      const startDate = new Date(filterOptions.startDate);
      filtered = filtered.filter(bill => new Date(bill.date) >= startDate);
    }
    
    if (filterOptions.endDate) {
      const endDate = new Date(filterOptions.endDate);
      endDate.setHours(23, 59, 59); // Set to end of day
      filtered = filtered.filter(bill => new Date(bill.date) <= endDate);
    }

    // Filter by amount range
    if (filterOptions.minAmount) {
      filtered = filtered.filter(bill => bill.grandTotal >= parseFloat(filterOptions.minAmount));
    }
    
    if (filterOptions.maxAmount) {
      filtered = filtered.filter(bill => bill.grandTotal <= parseFloat(filterOptions.maxAmount));
    }

    setFilteredBills(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadBill = async (billId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/bill/${billId}`
         , {
        withCredentials: true,
      }
      );
      
      // Find the client from the bill
      const billPartyId = response.data.partyId;
      const client = clients.find(c => c._id === billPartyId);
      
      // Dispatch actions to load the bill into your Redux store
      if (client) {
        dispatch({ type: 'client/setSelectedClient', payload: client });
      }
      
      // Load bill items into your bill state
      const billItems = response.data.items.map(item => ({
        id: item.skuId,
        objectid: item.skuId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice || "",
        total: item.total
      }));
      
      dispatch({ type: 'bill/setBill', payload: billItems });
      
      // Set bill metadata (invoice number, date, etc.)
      dispatch({ 
        type: 'bill/setMetadata', 
        payload: {
          invoiceNumber: response.data.invoiceNumber,
          date: response.data.date,
          billId: response.data._id
        }
      });
      
      // Close the modal
      onClose();
      
    } catch (error) {
      console.error("Error loading bill:", error);
      alert("Error loading bill. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-5xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bill Manager</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-100 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Party</label>
            <select 
              name="party"
              value={filterOptions.party}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Parties</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex space-x-2">
              <input 
                type="date" 
                name="startDate"
                value={filterOptions.startDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="From"
              />
              <input 
                type="date" 
                name="endDate"
                value={filterOptions.endDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="To"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                name="minAmount"
                value={filterOptions.minAmount}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Min"
              />
              <input 
                type="number" 
                name="maxAmount"
                value={filterOptions.maxAmount}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        
        {/* Bills Table */}
        {loading ? (
          <div className="text-center py-10">
            <p>Loading bills...</p>
          </div>
        ) : filteredBills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{bill.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(bill.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{bill.party.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bill.items.length} items</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{bill.grandTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => loadBill(bill._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => window.open(`${BACKEND_URL}/bill/print/${bill._id}`, '_blank', {
                          withCredentials: true,
                        })}
                        className="text-green-600 hover:text-green-900"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p>No bills found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillManager;
