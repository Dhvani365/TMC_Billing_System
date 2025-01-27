const PricingSelector = ({ pricingType, setPricingType }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-white">Pricing Type</label>
      <div className="relative">
        <select
          onChange={(e) => setPricingType(e.target.value)}
          value={pricingType}
          className="w-full p-2 rounded-md bg-zinc-800  text-white appearance-none"
        >
          <option value="Normal">Normal</option>
          <option value="Wholesale">Wholesale</option>
        </select>
        <div className="pointer-events-none absolute right-3 top-3 text-[#F6AE2D]">
          ▼
        </div>
      </div>
    </div>
  );
};

export default PricingSelector;
