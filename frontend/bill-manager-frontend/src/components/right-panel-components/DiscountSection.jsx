import { useState } from 'react';
import { Separator } from '../../components/ui/separator';

const DiscountSection = () => {
  const discounts = [
    { id: '201', name: 'Discount 1', normalPrice: 100, discountedPrice: 70 },
    { id: '202', name: 'Discount 2', normalPrice: 150, discountedPrice: 110 },
    { id: '203', name: 'Discount 3', normalPrice: 200, discountedPrice: 140 },
    { id: '204', name: 'Discount 4', normalPrice: 250, discountedPrice: 190 },
  ];

  const [selectedPriceType, setSelectedPriceType] = useState('normalPrice');

  return (
    <div className="relative h-[30%] p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-4">
        <img
          src="src/Logo/Discount.png"
          alt="Discount Logo"
          className="w-6 h-6 mr-2"
        />
        <h2 className="text-sm font-bold">Discounts</h2>
      </div>
      <ul className="overflow-y-auto max-h-[100%]">
        <li>
          <button
            className="w-full text-center px-4 py-2 hover:bg-slate-200 rounded justify-center"
          >
            Discount on Wholesale Price
          </button>
        </li>
        <Separator className="h-[2px] bg-black w-[100%] mt-[2%] rounded-md" />
        <li>
          <button
            className="w-full text-center px-4 py-2 hover:bg-slate-200 rounded justify-center"
          >
            Discount on Selling Price
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DiscountSection;
