/* ProductSection.jsx */
import { useState } from 'react';
import { Search } from 'lucide-react';
import ActionTooltip from '../bill/ActionTooltip';
import NavigationItem from './NavigationItem';

const ProductSelection = ({ selectedCatalog }) => {
  const productsData = {
    '001': [
      { id: '201', name: 'Product 1' },
      { id: '202', name: 'Product 2' },
    ],
    '002': [
      { id: '203', name: 'Product 3' },
      { id: '204', name: 'Product 4' },
    ],
    '003': [
      { id: '205', name: 'Product 5' },
      { id: '206', name: 'Product 6' },
    ],
    '004': [
      { id: '207', name: 'Product 7' },
      { id: '208', name: 'Product 8' },
    ],
  };

  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const products = selectedCatalog ? productsData[selectedCatalog] : [];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const displayedProducts = search ? filteredProducts : products;

  return (
    <div className="relative text-sm h-[50%] bg-zinc-950 flex flex-col items-center text-primary">
      <div className="w-full px-4 pl-[20%]">
        <div className="relative mt-2">
          <ActionTooltip side="right" align="center" label="Search Products">
            <Search
              style={{ color: 'white' }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Products"
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-8 py-2 rounded-md bg-zinc-800 text-white focus:outline-none"
            />
          </ActionTooltip>
        </div>
      </div>

      <div className="mt-4 w-[100%]">
        {selectedCatalog ? (
          displayedProducts.map((product) => (
            <div key={product.id} className="mb-4">
              <NavigationItem id={product.id} name={product.name} onClick={() => {}} />
            </div>
          ))
        ) : (
          <p className="text-white text-center">Please select a catalog to explore the products.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSelection;
