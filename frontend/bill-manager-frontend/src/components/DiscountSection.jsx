import { useState } from 'react';

const DiscountSection = () => {
  // Static discount options with IDs and prices
  const discounts = [
    { id: '201', name: 'Discount 1', normalPrice: 100, discountedPrice: 70 },
    { id: '202', name: 'Discount 2', normalPrice: 150, discountedPrice: 110 },
    { id: '203', name: 'Discount 3', normalPrice: 200, discountedPrice: 140 },
    { id: '204', name: 'Discount 4', normalPrice: 250, discountedPrice: 190 },
  ];

  const [search, setSearch] = useState('');
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [selectedPriceType, setSelectedPriceType] = useState('normalPrice');
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Filter discounts based on search input
    if (query) {
      const filtered = discounts.filter((discount) =>
        discount.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDiscounts(filtered);
    } else {
      setFilteredDiscounts([]);
    }
  };

  const handleDiscountSelect = (discount) => {
    setSelectedDiscount(discount);
    setFilteredDiscounts([]);
  };

  return (
    <div className="relative mb-4 p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-4">
        <img
          src="src/Logo/Discount.png"
          alt="Discount Logo"
          className="w-8 h-8 mr-2"
        />
        <h2 className="text-xl font-bold">Discounts</h2>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search Discounts"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filteredDiscounts.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {filteredDiscounts.map((discount) => (
              <li
                key={discount.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleDiscountSelect(discount)}
              >
                {discount.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDiscount && (
        <div className="mt-4">
          <div className="mb-2">Selected Discount: {selectedDiscount.name}</div>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedPriceType('normalPrice')}
              className={`px-4 py-2 rounded-md ${selectedPriceType === 'normalPrice' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Normal Price: ${selectedDiscount.normalPrice}
            </button>
            <button
              onClick={() => setSelectedPriceType('discountedPrice')}
              className={`px-4 py-2 rounded-md ${selectedPriceType === 'discountedPrice' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Discounted Price: ${selectedDiscount.discountedPrice}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
