import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Modal from '../left-panel-components/Modal';

const demoParties = [
  { id: 'P1', name: 'Grand Party', catalog: 'C1', project: 'PR1' },
  { id: 'P2', name: 'Elegant Dinner', catalog: 'C1', project: 'PR1' },
  { id: 'P3', name: 'Corporate Event', catalog: 'C1', project: 'PR2' },
  { id: 'P4', name: 'Casual Gathering', catalog: 'C2', project: 'PR3' },
  { id: 'P5', name: 'Birthday Bash', catalog: 'C2', project: 'PR3' },
  { id: 'P6', name: 'Wedding Celebration', catalog: 'C3', project: 'PR4' },
  { id: 'P7', name: 'Charity Gala', catalog: 'C3', project: 'PR5' },
  { id: 'P8', name: 'Outdoor Festival', catalog: 'C4', project: 'PR6' },
  { id: 'P9', name: 'Holiday Party', catalog: 'C4', project: 'PR6' },
  { id: 'P10', name: 'Nightlife Mixer', catalog: 'C5', project: 'PR7' },
  { id: 'P11', name: 'Networking Social', catalog: 'C5', project: 'PR7' },
  { id: 'P12', name: 'Cultural Meetup', catalog: 'C6', project: 'PR8' },
  { id: 'P13', name: 'Music Concert', catalog: 'C6', project: 'PR8' },
  { id: 'P14', name: 'Food Expo', catalog: 'C7', project: 'PR9' },
  { id: 'P15', name: 'Tech Conference', catalog: 'C7', project: 'PR9' },
];

const PartySection = ({ parties }) => {
  const [search, setSearch] = useState('');
  const [filteredParties, setFilteredParties] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setFilteredParties(
      query
        ? parties.filter((party) =>
            party.name.toLowerCase().includes(query.toLowerCase())
          )
        : []
    );
  };

  const displayParties = search ? filteredParties : demoParties;

  return (
    <div className="relative h-[50%] overflow-hidden bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-4">
        <img
          src="src/Logo/Party.png"
          alt="Party Logo"
          className="w-6 h-6 mr-2"
        />
        <h6 className="text-sm font-bold">Parties</h6>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search Parties"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-2 py-2 pr-10 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
      </div>
      <ul className="overflow-y-auto max-h-[50%]">
        {displayParties.slice(0, showMore ? displayParties.length : 10).map((party) => (
          <li
            key={party.id}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200 border-b border-gray-300"
          >
            {party.name}
          </li>
        ))}
      </ul>
      {displayParties.length > 10 && !showMore && (
        <div className="mt-1 flex justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-500 text-black hover:text-white underline cursor-pointer"
          >
            Show More
          </Button>
        </div>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">All Parties</h2>
            <ul>
              {displayParties.map((party) => (
                <li
                  key={party.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200 border-b border-gray-300"
                >
                  {party.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PartySection;
