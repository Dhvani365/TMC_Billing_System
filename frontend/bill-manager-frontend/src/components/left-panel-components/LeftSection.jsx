import React, { useState } from 'react';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import ActionTooltip from './ActionToolTip';
import { Search } from 'lucide-react';
import Modal from './Modal';
import NavigationItem from './NavigationItem';

const catalogs = [
  { id: '001', name: 'Catalog 1' },
  { id: '002', name: 'Catalog 2' },
  { id: '003', name: 'Catalog 3' },
  { id: '004', name: 'Catalog 4' },
];

const ProductSelection = ({ selectedCatalog }) => {
  const productsData = {
    '001': [
      { id: '201', name: 'Product 1' },
      { id: '202', name: 'Product 2' },
      { id: '203', name: 'Product 3' },
      { id: '204', name: 'Product 4' },
      { id: '205', name: 'Product 5' },
    ],
    '002': [
      { id: '206', name: 'Product 6' },
      { id: '207', name: 'Product 7' },
      { id: '208', name: 'Product 8' },
      { id: '209', name: 'Product 9' },
      { id: '210', name: 'Product 10' },
    ],
    '003': [
      { id: '211', name: 'Product 11' },
      { id: '212', name: 'Product 12' },
      { id: '213', name: 'Product 13' },
      { id: '214', name: 'Product 14' },
    ],
    '004': [
      { id: '215', name: 'Product 15' },
      { id: '216', name: 'Product 16' },
      { id: '217', name: 'Product 17' },
    ],
  };

  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
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
    <div className="w-full p-2 h-full">
        <div className="flex items-center mb-4 pl-2">
          <img
            src="src/Logo/Product.png"
            alt="Product Logo"
            className="w-6 h-6 mr-2 bg-white rounded-md"
          />
          <h6 className="text-sm text-white font-bold">Products</h6>
        </div>
      <div className="relative mt-2 mb-4">
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

      <div>
        {selectedCatalog ? (
          displayedProducts.length > 0 ? (
            displayedProducts.slice(0, showMore ? displayedProducts.length : 3).map((product) => (
              <div key={product.id} className="mb-4">
                <NavigationItem id={product.id} name={product.name} onClick={() => {}} />
              </div>
            ))
          ) : (
            <p className="text-white text-center">No products found.</p>
          )
        ) : (
          <p className="text-white text-center">Please select a catalog to explore the products.</p>
        )}
      </div>
      {displayedProducts.length > 2 && !showMore && (
        <div className="flex justify-center mt-4">
          <button
            className="text-white underline hover:text-yellow-500"
            onClick={() => setShowMore(true)}
          >
            Show More...
          </button>
        </div>
      )}
    </div>
  );
};

function LeftSection() {
  const [search, setSearch] = useState('');
  const [filteredCatalogs, setFilteredCatalogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query) {
      const filtered = catalogs.filter((catalog) =>
        catalog.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCatalogs(filtered);
    } else {
      setFilteredCatalogs([]);
    }
  };

  const displayedCatalogs = search ? filteredCatalogs : catalogs.slice(0, 3);

  const handleCatalogSelect = (catalogId) => {
    setSelectedCatalog(catalogId);
  };

  return (
    <div className="w-[20%] fixed top-[3.5rem] left-0 flex-col bg-zinc-950 h-[calc(100%)] text-sm ">
      {/* Catalog section */}
      <div className="px-2 py-2">
      <div className="flex items-center mb-4 pl-2">
          <img
            src="src/Logo/Catalog.png"
            alt="Catalog Logo"
            className="w-6 h-6 mr-2"
          />
          <h6 className="text-sm text-white font-bold">Catalogs</h6>
        </div>
        <div className="relative mb-4">
          {/* Search bar section */}
          <ActionTooltip side="right" align="center" label="Search a new catalog">
            <Search
              style={{ color: 'white' }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              className="w-full pl-8 py-2 rounded-md bg-zinc-800 text-white focus:outline-none"
              placeholder="Search Catalog"
              value={search}
              onChange={handleSearchChange}
            />
          </ActionTooltip>
        </div>

        {/* Catalog list section */}
        <ScrollArea className="mt-4 w-full">
          {displayedCatalogs.map((catalog) => (
            <div key={catalog.id} className="mb-4">
              <NavigationItem id={catalog.id} name={catalog.name} onClick={() => handleCatalogSelect(catalog.id)} />
            </div>
          ))}
        </ScrollArea>

        {/* Show more button */}
        {catalogs.length > 3 && (
        <div className="flex justify-center">
          <button
            className="text-white underline hover:text-yellow-500"
            onClick={() => setShowModal(true)}
          >
            Show More...
          </button>
          </div>
        )}

        {/* Modal section */}
        {showModal && (
          <Modal
            title="All Catalogs"
            items={catalogs}
            search={search}
            setSearch={setSearch}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Separator */}
        <Separator className="h-[2px] bg-white w-full mt-[8%] rounded-md" />
      </div>

      {/* Product section */}
      <ProductSelection selectedCatalog={selectedCatalog} />
    </div>
  );
}

export default LeftSection;
