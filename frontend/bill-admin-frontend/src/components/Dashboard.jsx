import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className='flex flex-row h-screen'>
        <div className='w-[15%]'>
            <Sidebar/>
        </div>
        <div className='w-[90%] flex h-screen bg-gray-100'>            
            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Header */}
              <div className="bg-white p-4 shadow rounded-md mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Richard!</p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6">
                <StatCard title="Total Users" value="1,245" />
                <StatCard title="Projects" value="87" />
                <StatCard title="Revenue" value="₹42,50,000" />
              </div>
            </div>
        </div>
    </div>
    
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-700">{value}</h2>
    </div>
  );
};

export default Dashboard;
