import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToBill } from "@/store/billSlice"; 
import { HiArrowSmallLeft } from "react-icons/hi2";

const OrderPanel = () => {
  const dispatch = useDispatch();
  
  const selectedBrand = useSelector((state) => state.brand.selectedBrand);
  const brandCatalogs = useSelector((state) => state.brand.brandCatalogs);
  const catalogProducts = useSelector((state) => state.catalog.catalogProducts);

  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPriceType, setSelectedPriceType] = useState("");

  const catalogs = selectedBrand ? brandCatalogs[selectedBrand] || [] : [];
  const products = selectedCatalog ? catalogProducts[selectedCatalog] || [] : [];

  const handleAddProduct = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (selectedProduct.priceType === "Both" && !selectedPriceType) {
      alert("Please select a pricing option (WSR or CP).");
      return;
    }

    const discount = selectedProduct.discountPercentage
      ? (selectedProduct.price * selectedProduct.discountPercentage) / 100
      : 0;
    const finalPrice = selectedProduct.price - discount;

    const productDetails = {
      id: selectedProduct.id,
      product: selectedProduct.name,
      price: selectedProduct.price,
      discount,
      finalPrice,
      priceType: selectedPriceType,
      quantity: 1,
      total: finalPrice.toFixed(2),
    };

    dispatch(addToBill(productDetails));
    setSelectedProduct(null);
    setSelectedPriceType("");
  };

  return (
    <div className="w-[80%] p-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4">Order Panel</h2>

      {!selectedBrand && (
        <p className="text-gray-500 italic">Please select a brand to see catalogs.</p>
      )}

      {selectedBrand && !selectedCatalog && (
        <div>
          <h3 className="text-md font-bold mb-2">Select a Catalog</h3>
          <div className="grid grid-cols-4 gap-4">
            {catalogs.length > 0 ? (
              catalogs.map((catalog) => (
                <div
                  key={catalog}
                  className="border p-3 rounded-md shadow-md cursor-pointer bg-white text-center hover:bg-gray-200"
                  onClick={() => setSelectedCatalog(catalog)}
                >
                  {catalog}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No catalogs available for this brand.</p>
            )}
          </div>
        </div>
      )}

      {selectedCatalog && (
        <div>
          <div className="flex items-center mb-4">
            <HiArrowSmallLeft className="text-xl text-[#123524] mr-2" />
            <button
              className="text-sm text-[#123524]"
              onClick={() => setSelectedCatalog(null)}
            >
              Back to Catalogs
            </button>
          </div>

          <h3 className="text-md font-bold mb-2">Products in {selectedCatalog}</h3>
          <div className="grid grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => {
                const discount = product.discountPercentage
                  ? (product.price * product.discountPercentage) / 100
                  : 0;
                const discountedPrice = product.price - discount;

                return (
                  <div 
                    key={product.id} 
                    className={`border cursor-pointer p-2 rounded-md shadow-md bg-white text-center ${selectedProduct?.id === product.id ? "border-green-500" : ""}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md" />
                    <h3 className="text-sm font-bold mt-2">{product.name}</h3>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    <p className="text-sm mt-1">Pricing: <b>{product.priceType}</b></p>
                    
                    {/* Show Discounted Price if applicable */}
                    {/* {product.discountPercentage > 0 ? (
                      <p className="text-sm mt-1 text-red-500">
                        <s>₹{product.price.toFixed(2)}</s> ₹{discountedPrice.toFixed(2)}
                        <span className="text-xs text-gray-600"> ({product.discountPercentage}% off)</span>
                      </p>
                    ) : (
                      <p className="text-sm mt-1">Price: ₹{product.price.toFixed(2)}</p>
                    )} */}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No products available in this catalog.</p>
            )}
          </div>

          {selectedProduct && selectedProduct.priceType === "Both" && (
            <div className="mt-4 flex items-center">
              <label className="mr-2 font-semibold">Select Price Type:</label>
              <select
                value={selectedPriceType}
                onChange={(e) => setSelectedPriceType(e.target.value)}
                className="border p-2 rounded-md w-[20%]"
              >
                <option value="">Select</option>
                <option value="WSR">WSR</option>
                <option value="CP">CP</option>
              </select>
            </div>
          )}

          {selectedProduct && (
            <div className="mt-4">
              <button 
                onClick={handleAddProduct} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add to Bill
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderPanel;
