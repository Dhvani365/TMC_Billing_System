import { useState } from "react";
import { useDispatch } from "react-redux";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import OrderPanel from "@/components/OrderPanel";
import BillArea from "@/components/BillArea";
import BillManager from "@/components/BillManager";

const Homepage = () => {
  const dispatch = useDispatch();

  // State to store current bill and saved bills
  const [bill, setBill] = useState([]);
  const [savedBills, setSavedBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Function to add a product to the bill
  const addProductToBill = (product) => {
    setBill((prevBill) => [...prevBill, product]);
  };

  // Function to save the current bill
  const handleSaveBill = () => {
    if (bill.length === 0) {
      alert("Cannot save an empty bill.");
      return;
    }

    const newBill = { items: bill, date: new Date().toISOString() };
    setSavedBills([...savedBills, newBill]);
    setBill([]); // Reset current bill after saving
  };

  // Function to select a bill from BillManager
  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setBill(bill.items);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <OrderPanel onAddProduct={addProductToBill} />
        
        {/* Middle Section: Bill Viewing Area */}
        {/* <div className="w-80% p-6 bg-[#FDFFFC]"> */}
        <BillArea bill={bill} onSave={handleSaveBill} />
        {/* </div> */}

        {/* Right Section: Bill Manager Area */}
        {/* <div className="w-1/5 p-6 bg-[#FDFFFC] border-l-2 border-[#F6AE2D] text-[#011627]">
          <BillManager bills={savedBills} onSelect={handleSelectBill} />
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
