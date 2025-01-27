import React, { useRef } from 'react';
import { FaTimes, FaPrint, FaRedo } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const BillArea = ({ bill, onRemove, onReset }) => {
  const billRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
  });

  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bill Details</h2>
        <div className="flex space-x-2">
          <button
            onClick={onReset}
            className="text-red-500 hover:text-red-700 transition"
          >
            <FaRedo size={20} />
          </button>
          <button
            onClick={handlePrint}
            className="text-green-500 hover:text-green-700 transition"
          >
            <FaPrint size={20} />
          </button>
        </div>
      </div>
      <div className="border border-[#F6AE2D] p-4 rounded-lg" ref={billRef}>
        {bill.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">#</th>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">Product</th>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">Party</th>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">Price</th>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">Qty</th>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">Total</th>
                  <th className="border-b border-[#F6AE2D] py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 text-center">{index + 1}</td>
                    <td className="py-2 text-center">{item.product}</td>
                    <td className="py-2 text-center">{item.party}</td>
                    <td className="py-2 text-center">₹{item.price}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-center">₹{item.total}</td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() => onRemove(index)}
                        className="text-red-500 hover:text-red-700 flex items-center justify-center m-auto"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr className="my-4 border-[#F6AE2D]" />
            <div className="mt-4 text-lg font-bold flex justify-end">
              <span>Total: ₹{total.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p>No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default BillArea;