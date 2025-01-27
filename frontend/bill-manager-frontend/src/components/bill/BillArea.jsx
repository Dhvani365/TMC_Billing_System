import React, { useRef, useState, useEffect } from 'react';
import { FaTimes, FaPrint, FaRedo, FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';

const BillArea = ({ bill, onRemove, onReset, onSave }) => {
  const contentRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [removingIndex, setRemovingIndex] = useState(null);
  const [currentBill, setCurrentBill] = useState(bill || []);

  useEffect(() => {
    setCurrentBill(bill || []);
  }, [bill]);

  const total = currentBill.reduce((acc, item) => acc + parseFloat(item.total), 0);

  const totalPages = Math.ceil(currentBill.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = currentBill.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRemove = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      setCurrentBill((prevBill) => prevBill.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 300); // Duration of the fade-out effect
  };

  const handleSave = () => {
    onSave(currentBill);
  };

  const handlePrint = () => {
    const printContent = contentRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Bill</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; }');
    printWindow.document.write('.print-hidden { display: none !important; }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>Bill Details</h2>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#F6AE2D]">Bill Details</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            <FaSave size={20} />
          </button>
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
      <hr className="my-4 border-b border-[#F6AE2D]" />
      <div
        className="border-2 border-[#F6AE2D] bg-[#FDFFFC] text-[#011627] p-4 rounded-lg"
        ref={contentRef}
      >
        {currentBill.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center">#</th>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center">Product</th>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center">Party</th>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center">Price</th>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center">Qty</th>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center">Total</th>
                  <th className="border-b-2 border-[#F6AE2D] py-2 text-center print-hidden">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className={`transition-opacity duration-300 ${removingIndex === startIndex + index ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <td className="py-2 text-center">{startIndex + index + 1}</td>
                    <td className="py-2 text-center">{item.product}</td>
                    <td className="py-2 text-center">{item.party}</td>
                    <td className="py-2 text-center">₹{item.price}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-center">₹{item.total}</td>
                    <td className="py-2 text-center print-hidden">
                      <button
                        onClick={() => handleRemove(startIndex + index)}
                        className="text-red-500 hover:text-red-700 flex items-center justify-center m-auto"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr className="my-4 border-b border-[#F6AE2D]" />
            <div className="mt-4 text-lg font-bold flex justify-between items-center ">
              <div className="flex items-center print-hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="text-[#F6AE2D] p-2 rounded-lg disabled:opacity-50"
                >
                  <FaArrowLeft />
                </button>
                <span className="mx-4">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="text-[#F6AE2D] p-2 rounded-lg disabled:opacity-50"
                >
                  <FaArrowRight />
                </button>
              </div>
              <div className="flex items-center">
                <span>Total: ₹{total.toFixed(2)}</span>
              </div>
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