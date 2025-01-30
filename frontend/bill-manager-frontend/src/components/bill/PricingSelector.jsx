const PricingSelector = ({ pricingType, setPricingType }) => {
    return (
      <div className="mb-4">
        <label className="block mb-2">Pricing Type</label>
        <select
          onChange={(e) => setPricingType(e.target.value)}
          value={pricingType}
          className="w-full p-2 rounded-md bg-zinc-800 "
        >
          <option value="Normal">Normal</option>
          <option value="Wholesale">Wholesale</option>
        </select>
      </div>
    );
  };
  
  export default PricingSelector;