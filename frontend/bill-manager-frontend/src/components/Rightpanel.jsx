import PartySection from './right-panel-components/PartySection';
import DiscountSection from './right-panel-components/DiscountSection';

const RightPanel = () => {
    return (
      <div className="w-[100%] bg-gray-100 text-sm max-h-[100%]">
        <PartySection />
        <DiscountSection />
      </div>
    );
  };
  
  export default RightPanel;
  