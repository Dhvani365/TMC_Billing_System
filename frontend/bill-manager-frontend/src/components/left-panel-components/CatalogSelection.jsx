/* CatalogSection.jsx */
import React, { useState } from 'react';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import ActionTooltip from '../bill/ActionTooltip';
import { Search } from 'lucide-react';
import Modal from './Modal';
import NavigationItem from './NavigationItem';

const catalogs = [
  { id: '001', name: 'Catalog 1' },
  { id: '002', name: 'Catalog 2' },
  { id: '003', name: 'Catalog 3' },
  { id: '004', name: 'Catalog 4' },
];

function CatalogSelection({ onSelectCatalog }) {
  const [search, setSearch] = useState('');
  const [filteredCatalogs, setFilteredCatalogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="relative text-sm top-0 left-0 h-[50%] bg-zinc-950 flex flex-col items-center text-primary">
      <div className="w-full px-4 pl-[20%]">
        <div className="relative mt-2">
          <ActionTooltip side="right" align="center" label="Search a new catalog">
            <Search
              style={{ color: 'white' }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              className="w-[100%] pl-8 py-2 rounded-md bg-zinc-800 text-white focus:outline-none"
              placeholder="Search Catalog"
              value={search}
              onChange={handleSearchChange}
            />
          </ActionTooltip>
        </div>
      </div>

      <ScrollArea className="mt-4 w-[100%]">
        {displayedCatalogs.map((catalog) => (
          <div key={catalog.id} className="mb-4">
            <NavigationItem id={catalog.id} name={catalog.name} onClick={onSelectCatalog} />
          </div>
        ))}
      </ScrollArea>
      {catalogs.length > 3 && (
        <button
          className="mt-2 text-white underline"
          onClick={() => setShowModal(true)}
        >
          Show More...
        </button>
      )}

      {showModal && (
        <Modal
          title="All Catalogs"
          items={catalogs}
          search={search}
          setSearch={setSearch}
          onClose={() => setShowModal(false)}
        />
      )}
      <Separator className="h-[2px] bg-white w-[100%] mt-[2%] rounded-md" />
    </div>
  );
}

export default CatalogSelection;
