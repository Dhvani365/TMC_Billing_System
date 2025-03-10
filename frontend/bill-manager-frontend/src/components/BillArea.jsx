import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBill, resetBill, updateQuantity } from '@/store/billSlice';
import { FaTimes } from 'react-icons/fa';
import { Separator } from "@radix-ui/react-separator";
import './BillArea.css';
const BillArea = () => {
  const dispatch = useDispatch();

  // Use defaultBill if Redux state is empty
  // const bill = useSelector(state.bill.items);
  const bill = useSelector((state) => state.bill.items);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
  const totalPages = Math.ceil(bill.length / itemsPerPage);
  const currentItems = bill.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  // Handle quantity change and dispatch the update action
  const handleQuantityChange = (itemId, newQuantity) => {
    const numericQuantity = parseInt(newQuantity);
    if (!isNaN(numericQuantity) && numericQuantity >= 0) {
      dispatch(updateQuantity({ id: itemId, quantity: numericQuantity }));
    }
  };

  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id: itemId, quantity: currentQuantity - 1 }));
    }
  };

  const handleIncrease = (itemId, currentQuantity) => {
    dispatch(updateQuantity({ id: itemId, quantity: currentQuantity + 1 }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = (bill) => {
    // Implement your save logic here
    alert("Bill saved successfully"); 
  }

  return (
    <div className="w-[50%] p-5 m-3 bg-zinc-100 rounded-xl shadow-sm flex flex-col justify-between h-[85%] printableArea">
      <h2 className="text-xl font-bold text-black mb-2">Bill Details</h2>

      {/* Scrollable Table */}
      <div className="overflow-auto flex-grow shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-green-300">
              <th className='border border-gray-800'>#</th>
              <th className='border border-gray-800'>Product Name</th>
              <th className='border border-gray-800'>Quantity</th>
              <th className='border border-gray-800'>Price</th>
              <th className='border border-gray-800'>Discounted Price</th>  
              <th className='border border-gray-800'>Total</th>   
              <th></th>             
            </tr>
          </thead>
          <tbody className="text-center border border-gray-800 divide-y divide-gray-800 rounded-md">
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className='border border-gray-800'>{index + 1}</td>
                <td className='border border-gray-800'>{item.productName}</td>
                <td className='border border-gray-800'>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="px-2 bg-red-500 text-white rounded"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-10 text-center border border-gray-300"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="px-2 bg-green-500 text-white rounded"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className='border border-gray-800'>₹{item.price}</td>
                <td className='border border-gray-800'>₹{item.discountedPrice}</td>
                <td className='border border-gray-800'>₹{item.total}</td>
                <td className='border border-gray-800'>
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
      <div className="relative w-full">
        {/* Right-aligned Total Amount */}
        <div className="text-right text-lg font-semibold mb-2 pr-10 bg-yellow-100 rounded-sm shadow-md">
          <p>Total Amount: ₹{total.toFixed(2)}</p>
        </div>

        {/* Separator */}
        <Separator className="bg-gray-700 w-full h-px my-2" />

        {/* Left-aligned Buttons */}
        <div className="flex justify-end space-x-10 p-3 bg-zinc-300 rounded-md shadow-xl">
          <button
            onClick={() => handleSave(bill)}
            className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Save
          </button>
          <button
            onClick={() => dispatch(resetBill())}
            className="text-white bg-red-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Reset
          </button>
          <button
            onClick={handlePrint}
            className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillArea;