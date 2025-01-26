import CatalogSelection from './left-panel-components/CatalogSelection';
import ProductSelection from './left-panel-components/ProductSelection';
import { useState } from 'react';
const LeftPanel = () => {
  const [selectedCatalog, setSelectedCatalog] = useState('');
  return (
    <div className="w-[100%]">
      <CatalogSelection onSelectCatalog={setSelectedCatalog} />
      <ProductSelection selectedCatalog={selectedCatalog} />
    </div>
  );
};

export default LeftPanel;
