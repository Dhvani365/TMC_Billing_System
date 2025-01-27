/* Modal.jsx */
import { Search } from 'lucide-react';
import { Tooltip } from '../../components/ui/tooltip';

const Modal = ({ title, items, search, setSearch, onClose }) => {
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredItems = search
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90%] overflow-y-auto">
      {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-500 font-bold">X</button>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-black-800" />
        </div>

        {/* Filtered Items List */}
        <Tooltip content={`Filtered ${title} items`}>
          <ul>
          {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li key={item.id} className="px-4 py-2 border-b hover:bg-gray-200">
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No items found</li>
            )}
          </ul>
        </Tooltip>
      </div>
    </div>
  );
};

export default Modal;
