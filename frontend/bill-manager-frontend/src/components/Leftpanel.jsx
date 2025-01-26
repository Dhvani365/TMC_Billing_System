import CatalogSelection from './CatalogSelection';
import ProductSelection from './ProductSelection';
import PartySection from './PartySection';
import DiscountSection from './DiscountSection';

const LeftPanel = () => {
  return (
    <aside className="w-1/4 bg-gray-600 p-4">
      <CatalogSelection />
      <ProductSelection />
      <PartySection />
      <DiscountSection />
    </aside>
  );
};

export default LeftPanel;
