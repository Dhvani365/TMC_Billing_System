import React from 'react';
import BillList from './BillList';

const BillManager = ({ bills, onSelect }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4">
        <BillList bills={bills} onSelect={onSelect} />
      </div>
    </div>
  );
};

export default BillManager;