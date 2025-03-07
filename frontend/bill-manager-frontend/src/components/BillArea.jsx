import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBill, resetBill, updateQuantity } from '@/store/billSlice';
import { FaTimes } from 'react-icons/fa';
import { Separator } from "@radix-ui/react-separator";

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
  // If input is empty, we treat the quantity as 0
  if (newQuantity === '') {
    dispatch(updateQuantity({ id: itemId, quantity: '-' }));
  } else {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity }));
    }
  }
};

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold text-black mb-4">Bill Details</h2>

      <div className="flex flex-col max-h-[400px] overflow-auto">
        <table className="w-full mb-6">
          <thead>
            <tr className="bg-zinc-300">
              <th>#</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discounted Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.product}</td>
                <td>
                  <input
                    type="number"
                    min="0"
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

      {/* Fixed container for Total Amount, Separator, and Buttons */}
      <div className="absolute top-[55%] w-[100%] bg-white">

      {/* Right-aligned Total Amount */}
      <div className="text-right text-lg font-semibold mb-2 pr-10 bg-zinc-200">
        <p>Total Amount: ₹{total.toFixed(2)}</p>
      </div>

      {/* Separator */}
      <Separator className="bg-gray-700 w-full h-px my-2" />

      {/* Left-aligned Buttons */}
      <div className="flex justify-center space-x-20">
        <button
          onClick={() => onSave(bill)}
          className="text-blue-400 hover:bg-blue-500 hover:text-white px-5 py-2 border border-blue-400 rounded-sm"
        >
          Save
        </button>
        <button
          onClick={() => dispatch(resetBill())}
          className="text-blue-400 hover:bg-blue-500 hover:text-white px-5 py-2 border border-blue-400 rounded-sm"
        >
          Reset
        </button>
        <button
          onClick={() => window.print()}
          className="text-blue-400 hover:bg-blue-500 hover:text-white px-5 py-2 border border-blue-400 rounded-sm"
        >
          Print
        </button>
      </div>
      </div>


    </div>
  );
};

export default BillArea;
