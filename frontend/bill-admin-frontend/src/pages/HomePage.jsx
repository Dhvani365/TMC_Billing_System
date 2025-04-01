import React from 'react'
import Sidebar from "../components/Sidebar";
import Dashboard from '../components/Dashboard';


function HomePage() {
  return (
    <div className='flex flex-row h-screen'>
        {/* <div className='w-[15%]'>
            <Sidebar/>
        </div> */}
        <div className='w-[100%]'>
            <Dashboard/>
        </div>
    </div>
  )
}

export default HomePage;