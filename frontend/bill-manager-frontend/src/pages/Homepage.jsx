import Navbar from '../components/Navbar';
import LeftPanel from '../components/Leftpanel';
import MainPanel from '../components/Mainpanel';
import RightPanel from '../components/Rightpanel';

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
          <LeftPanel />
          <RightPanel />
        <MainPanel />        
    </div>
  );
};

export default Homepage;
