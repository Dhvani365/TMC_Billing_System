import { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline'; // Assuming you installed Heroicons

const PartySelection = () => {
  // Static party options with IDs
  const parties = [
    { id: '101', name: 'Party 1' },
    { id: '102', name: 'Party 2' },
    { id: '103', name: 'Party 3' },
    { id: '104', name: 'Party 4' },
  ];

  const [search, setSearch] = useState('');
  const [filteredParties, setFilteredParties] = useState([]);

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Filter parties based on search input
    if (query) {
      const filtered = parties.filter((party) =>
        party.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredParties(filtered);
    } else {
      setFilteredParties([]);
    }
  };

  return (
    <div className="relative mb-4 p-4 bg-white shadow-md rounded-lg">
      {/* Logo and Title */}
      <div className="flex items-center mb-4">
        <img
          src="src/Logo/Party.png" 
          alt="Party Logo"
          className="w-8 h-8 mr-2"
        />
        <h2 className="text-xl font-bold">Parties</h2>
      </div>

      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Parties"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-black-800" />

        {/* Dropdown with filtered parties */}
        {filteredParties.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {filteredParties.map((party) => (
              <li
                key={party.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSearch(party.name);
                  setFilteredParties([]);
                }}
              >
                {party.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PartySelection;
