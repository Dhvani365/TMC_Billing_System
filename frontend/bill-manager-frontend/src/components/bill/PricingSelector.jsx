const PricingSelector = ({ pricingType, setPricingType }) => {
    return (
      <div className="mb-4">
        <label className="block mb-2">Pricing Type</label>
        <select
          onChange={(e) => setPricingType(e.target.value)}
          value={pricingType}
          className="w-full p-2 rounded-lg bg-[#011627] border border-[#F6AE2D]"
        >
          <option value="Normal">Normal</option>
          <option value="Wholesale">Wholesale</option>
        </select>
      </div>
    );
  };
  
  export default PricingSelector;