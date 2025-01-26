import Navbar from '../components/Navbar';
import LeftPanel from '../components/Leftpanel';
import MainPanel from '../components/Mainpanel';
import RightPanel from '../components/Rightpanel';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <LeftPanel />
        <MainPanel />
        <RightPanel />
      </div>
    </div>
  );
};

export default Homepage;
