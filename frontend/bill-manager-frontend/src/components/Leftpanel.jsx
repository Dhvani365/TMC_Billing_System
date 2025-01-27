import LeftSection from './left-panel-components/LeftSection';

import { useState } from 'react';
const LeftPanel = () => {
  const [selectedCatalog, setSelectedCatalog] = useState('');
  return (
    <div className="w-[100%]">
      <LeftSection />
    </div>
  );
};

export default LeftPanel;
