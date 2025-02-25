import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBill, resetBill, updateQuantity } from '@/store/billSlice';
import { FaTimes } from 'react-icons/fa';

const BillArea = ({ onSave }) => {
  const dispatch = useDispatch();
  const bill = useSelector((state) => state.bill.items);
  const contentRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
  const totalPages = Math.ceil(bill.length / itemsPerPage);
  const currentItems = bill.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle quantity change and dispatch the update action
  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity }));
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold text-black mb-4">Bill Details</h2>

      <div className="relative max-h-[400px] overflow-auto">
        <table className="w-full mb-6">
          <thead>
            <tr className="bg-zinc-300">
              <th>#</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discounted Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.product}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 border border-gray-300 rounded px-2"
                  />
                </td>
                <td>₹{item.price}</td>
                <td>₹{item.discount}</td>
                <td>₹{item.total}</td>
                <td>
                  <button onClick={() => dispatch(removeFromBill(item.id))}>
                    <FaTimes size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Total Amount */}
      <div className="text-right text-lg font-semibold mb-6">
        <p>Total Amount: ₹{total.toFixed(2)}</p>
      </div>

      {/* Fixed Buttons at the bottom of Bill Area */}
      <div className="sticky bottom-0 bg-white py-2 flex justify-end space-x-2 border-t border-gray-300">
        <button
          onClick={() => onSave(bill)}
          className="text-blue-400 hover:bg-blue-400 hover:text-white px-5 py-2 border border-blue-400 rounded-md"
        >
          Save
        </button>
        <button
          onClick={() => dispatch(resetBill())}
          className="text-blue-400 hover:bg-blue-400 hover:text-white px-5 py-2 border border-blue-400 rounded-md"
        >
          Reset
        </button>
        <button
          onClick={() => window.print()}
          className="text-blue-400 hover:bg-blue-400 hover:text-white px-5 py-2 border border-blue-400 rounded-md"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default BillArea;
