import React from "react";
import { useSelector } from "react-redux";

const OrderPanel = () => {
  const selectedCatalog = useSelector((state) => state.catalog.selectedCatalog);
  const catalogProducts = useSelector((state) => state.catalog.catalogProducts);
  const products = selectedCatalog ? catalogProducts[selectedCatalog] || [] : [];

  console.log("Selected Catalog:", selectedCatalog);
  console.log("Catalog Products:", catalogProducts);
  console.log("Filtered Products:", products);
  
  return (
    <div className="w-[80%] p-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4">Products</h2>

      {selectedCatalog ? (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-2 rounded-md shadow-md bg-white text-center">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md" />
              <h3 className="text-sm font-bold mt-2">{product.name}</h3>
              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Select a catalog to see products.</p>
      )}
    </div>
  );
};

export default OrderPanel;
