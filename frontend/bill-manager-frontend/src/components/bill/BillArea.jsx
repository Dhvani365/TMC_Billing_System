const BillArea = ({ bill }) => {
  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bill Details</h2>
      {bill.length > 0 ? (
        <>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-accent-f6ae2d py-2">Product</th>
                <th className="border-b border-accent-f6ae2d py-2">Party</th>
                <th className="border-b border-accent-f6ae2d py-2">Price</th>
                <th className="border-b border-accent-f6ae2d py-2">Qty</th>
                <th className="border-b border-accent-f6ae2d py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">{item.product}</td>
                  <td className="py-2">{item.party}</td>
                  <td className="py-2">₹{item.price}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-lg font-bold">Total: ₹{total.toFixed(2)}</div>
        </>
      ) : (
        <p>No products added yet.</p>
      )}
    </div>
  );
};

export default BillArea;
