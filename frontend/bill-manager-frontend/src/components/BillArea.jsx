import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBill, resetBill } from '@/store/billSlice';
import { FaTimes, FaPrint, FaRedo, FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';

const BillArea = ({ onSave }) => {
  const dispatch = useDispatch();
  const bill = useSelector((state) => state.bill.items);
  const contentRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
  const totalPages = Math.ceil(bill.length / itemsPerPage);
  const currentItems = bill.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#F6AE2D]">Bill Details</h2>
        <div className="flex space-x-2">
          <button onClick={() => onSave(bill)} className="text-blue-500 hover:text-blue-700">
            <FaSave size={20} />
          </button>
          <button onClick={() => dispatch(resetBill())} className="text-red-500 hover:text-red-700">
            <FaRedo size={20} />
          </button>
          <button onClick={() => window.print()} className="text-green-500 hover:text-green-700">
            <FaPrint size={20} />
          </button>
        </div>
      </div>
      <table border="5px" className="w-full">
        <thead>
          <tr>
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
              <td>{item.quantity}</td>
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
  );
};

export default BillArea;
