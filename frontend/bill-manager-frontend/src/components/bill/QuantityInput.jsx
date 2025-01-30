const QuantityInput = ({ quantity, setQuantity }) => {
    return (
      <div className="mb-4">
        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full p-2 rounded-md bg-zinc-800"
        />
      </div>
    );
  };
  
  export default QuantityInput;