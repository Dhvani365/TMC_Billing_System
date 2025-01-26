import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
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

const RightSection = () => {
  const [search, setSearch] = useState('');
  const [filteredParties, setFilteredParties] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPriceType, setSelectedPriceType] = useState('normalPrice');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setFilteredParties(
      query
        ? demoParties.filter((party) =>
            party.name.toLowerCase().includes(query.toLowerCase())
          )
        : []
    );
  };

  const displayParties = search ? filteredParties : demoParties.slice(0, 3);

  const discounts = [
    { id: '201', name: 'Discount 1', normalPrice: 100, discountedPrice: 70 },
    { id: '202', name: 'Discount 2', normalPrice: 150, discountedPrice: 110 },
    { id: '203', name: 'Discount 3', normalPrice: 200, discountedPrice: 140 },
    { id: '204', name: 'Discount 4', normalPrice: 250, discountedPrice: 190 },
  ];

  return (
    <div className="fixed left-[20%] w-[20%] top-[4rem] h-full flex-col bg-white shadow-md rounded-lg">
      {/* Party Section */}
      <div className="relative mb-5">
        <div className="flex items-center mb-4 pl-4">
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
            className="w-full pl-8 py-2 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
        </div>
        <ul className="overflow-y-auto max-h-[50%]">
          {displayParties.slice(0, showMore ? displayParties.length : 3).map((party) => (
            <li
              key={party.id}
              className="px-5 py-3 cursor-pointer hover:bg-gray-200 border-b border-gray-300"
            >
              {party.name}
            </li>
          ))}
        </ul>
        {displayParties.length > 2 && (
          <div className="flex justify-center py-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-500 text-black hover:text-yellow-600 underline cursor-pointer"
            >
              Show More...
            </Button>
          </div>
        )}
              
        {/* {isModalOpen && (
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
        )} */}
      </div>

      {/* Discount Section */}
      <div className="relative h-full p-4 bg-white shadow-md rounded-lg">
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
    </div>
  );
};

export default RightSection;
