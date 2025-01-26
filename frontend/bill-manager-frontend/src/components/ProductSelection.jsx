import { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline'; // Assuming you installed Heroicons

const ProductSelection = () => {
  // Static product options with IDs
  const products = [
    { id: '201', name: 'Product 1' },
    { id: '202', name: 'Product 2' },
    { id: '203', name: 'Product 3' },
    { id: '204', name: 'Product 4' },
  ];

  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Filter products based on search input
    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  return (
    <div className="relative mb-4 p-4 bg-white shadow-md rounded-lg">
      {/* Logo and Title */}
      <div className="flex items-center mb-4">
        <img
          src="src/Logo/Product.png" 
          alt="Product Logo"
          className="w-8 h-8 mr-2"
        />
        <h2 className="text-xl font-bold">Products</h2>
      </div>

      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Products"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-black-800" />

        {/* Dropdown with filtered products */}
        {filteredProducts.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSearch(product.name);
                  setFilteredProducts([]);
                }}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductSelection;
