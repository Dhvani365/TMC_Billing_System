import Navbar from '../components/Navbar';
import BillSystem from '../components/bill/BillSystem';

const Homepage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow h-full">
        <BillSystem />
      </div>
    </div>
  );
};

export default Homepage;