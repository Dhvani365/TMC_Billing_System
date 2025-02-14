import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import OrderPanel from "@/components/OrderPanel";
import PaymentOptions from "@/components/PaymentOptions";

const Homepage = () => {
  return (
    <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <OrderPanel />
          <PaymentOptions />
        </div>
      </div>
  );
};

export default Homepage;