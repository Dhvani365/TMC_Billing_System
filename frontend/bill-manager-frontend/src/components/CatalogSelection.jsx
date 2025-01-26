import { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline'; // Assuming you installed Heroicons

const CatalogSelection = () => {
  // Static catalog options with IDs
  const catalogs = [
    { id: '001', name: 'Catalog 1' },
    { id: '002', name: 'Catalog 2' },
    { id: '003', name: 'Catalog 3' },
    { id: '004', name: 'Catalog 4' },
  ];

  const [search, setSearch] = useState('');
  const [filteredCatalogs, setFilteredCatalogs] = useState([]);

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Filter catalogs based on search input
    if (query) {
      const filtered = catalogs.filter((catalog) =>
        catalog.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCatalogs(filtered);
    } else {
      setFilteredCatalogs([]);
    }
  };

  return (
    <div className="relative mb-4 p-4 bg-white shadow-md rounded-lg">
      {/* Logo and Title */}
      <div className="flex items-center mb-4">
        <img
          src="src/Logo/Catalog.png" 
          alt="Catalog Logo"
          className="w-8 h-8 mr-2"
        />
        <h2 className="text-xl font-bold">Catalogs</h2>
      </div>

      {/* Search Box */} 
      <div className="relative">
        <input
          type="text"
          placeholder="Catalogs"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-black-800" />

        {/* Dropdown with filtered catalogs */}
        {filteredCatalogs.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {filteredCatalogs.map((catalog) => (
              <li
                key={catalog.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSearch(catalog.name);
                  setFilteredCatalogs([]);
                }}
              >
                {catalog.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CatalogSelection;
