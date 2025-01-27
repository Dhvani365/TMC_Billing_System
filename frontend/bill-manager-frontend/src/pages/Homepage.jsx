import Navbar from '../components/Navbar';
import BillSystem from '../components/bill/BillSystem';

const Homepage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow h-full">
        <BillSystem />
      </div>
// =======
//     <div className="min-h-screen">
//       <Navbar />
//           <LeftPanel />
//           <RightPanel />
//         <MainPanel />        
// >>>>>>> main
    </div>
  );
};

export default Homepage;