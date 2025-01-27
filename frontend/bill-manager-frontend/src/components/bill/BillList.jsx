import React from 'react';

const BillList = ({ bills, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Saved Bills</h2>
      <ul className="list-disc pl-5">
        {bills.map((bill, index) => (
          <li key={index} className="cursor-pointer hover:text-[#F6AE2D]" onClick={() => onSelect(bill)}>
            {new Date(bill.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillList;