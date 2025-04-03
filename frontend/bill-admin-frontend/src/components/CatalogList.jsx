import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const brandsData = [
  { id: 1, name: "Nike" },
  { id: 2, name: "Adidas" },
  { id: 3, name: "Puma" },
];

const catalogsData = [
  { id: 1, brandId: 1, name: "Nike Summer Collection" },
  { id: 2, brandId: 1, name: "Nike Winter Collection" },
  { id: 3, brandId: 2, name: "Adidas Originals" },
  { id: 4, brandId: 3, name: "Puma Sports" },
];

const skusData = {
  1: [
    { id: 101, name: "Nike Air Max", image: "https://via.placeholder.com/100", cpPrice: 150, wsrPrice: 120 },
    { id: 102, name: "Nike Zoom", image: "https://via.placeholder.com/100", cpPrice: 180, wsrPrice: 140 },
  ],
  2: [
    { id: 103, name: "Nike Jacket", image: "https://via.placeholder.com/100", cpPrice: 200, wsrPrice: 170 },
  ],
  3: [
    { id: 104, name: "Adidas Superstar", image: "https://via.placeholder.com/100", cpPrice: 130, wsrPrice: 100 },
    { id: 105, name: "Adidas Ultraboost", image: "https://via.placeholder.com/100", cpPrice: 190, wsrPrice: 160 },
  ],
  4: [
    { id: 106, name: "Puma Running Shoes", image: "https://via.placeholder.com/100", cpPrice: 140, wsrPrice: 110 },
  ],
};

export default function CatalogList() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCatalog, setSelectedCatalog] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSku, setEditingSku] = useState(null);
  const [editedSku, setEditedSku] = useState({});
  const [selectedSkus, setSelectedSkus] = useState([]); // Track selected SKUs
  const searchInputRef = useRef(null); // Ref for the search bar

  const [catalogs, setCatalogs] = useState(catalogsData); // Manage catalogs state
  const [skus, setSkus] = useState(skusData); // Manage SKUs state

  // Filter catalogs based on selected brand
  const filteredCatalogs = catalogs.filter((catalog) => catalog.brandId === Number(selectedBrand));

  // Get SKUs for the selected catalog
  const catalogSkus = skus[selectedCatalog] || [];

  // Filter SKUs based on search term
  const filteredSKUs = catalogSkus.filter((sku) =>
    sku.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle editing an SKU
  const handleEditClick = (sku) => {
    setEditingSku(sku.id);
    setEditedSku({ ...sku });
  };

  // Handle saving the edited SKU
  const handleSaveClick = () => {
    const updatedSkus = catalogSkus.map((sku) =>
      sku.id === editingSku ? { ...sku, ...editedSku } : sku
    );
    setSkus({ ...skus, [selectedCatalog]: updatedSkus });
    setEditingSku(null);
  };

  // Handle selecting/deselecting an SKU
  const handleSkuSelect = (skuId) => {
    setSelectedSkus((prevSelected) =>
      prevSelected.includes(skuId)
        ? prevSelected.filter((id) => id !== skuId)
        : [...prevSelected, skuId]
    );
  };

  // Handle exporting selected SKUs
  const handleExportSkus = () => {
    const exportedData = catalogSkus.filter((sku) => selectedSkus.includes(sku.id));
    console.log("Exported SKUs Data:", exportedData);
    alert("Exported SKUs data has been logged to the console.");
  };

  // Handle deleting selected SKUs
  const handleDeleteSkus = () => {
    const updatedSkus = catalogSkus.filter((sku) => !selectedSkus.includes(sku.id));
    setSkus({ ...skus, [selectedCatalog]: updatedSkus });
    setSelectedSkus([]); // Clear selected SKUs
    alert("Selected SKUs have been deleted.");
  };

  // Handle deleting the selected catalog
  const handleDeleteCatalog = () => {
    const updatedCatalogs = catalogs.filter((catalog) => catalog.id !== Number(selectedCatalog));
    const updatedSkus = { ...skus };
    delete updatedSkus[selectedCatalog]; // Remove SKUs for the deleted catalog

    setCatalogs(updatedCatalogs);
    setSkus(updatedSkus);
    setSelectedCatalog(""); // Reset selected catalog
    alert("The selected catalog has been deleted.");
  };

  // Focus on the search bar when a catalog is selected
  const handleCatalogChange = (catalogId) => {
    setSelectedCatalog(catalogId);
    setTimeout(() => searchInputRef.current?.focus(), 0); // Focus on the search bar
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catalog List</h1>

      {/* Dropdowns + Add Catalog Button */}
      <div className="flex items-center gap-4 mb-6">
        {/* Brand Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Select Brand</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedCatalog(""); // Reset catalog when brand changes
            }}
          >
            <option value="">-- Select Brand --</option>
            {brandsData.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Catalog Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Select Catalog</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedCatalog}
            onChange={(e) => handleCatalogChange(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">-- Select Catalog --</option>
            {filteredCatalogs.map((catalog) => (
              <option key={catalog.id} value={catalog.id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        {selectedCatalog && (
          <div className="mt-7">
            <input
              type="text"
              placeholder="Search SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={searchInputRef} // Attach ref to the search bar
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
        <button
          onClick={() => navigate("/add-catalog")}
          className="bg-green-500 text-white px-4 py-2 mt-7 rounded-md hover:bg-green-600 transition"
        >
          + Add Catalog
        </button>
      </div>

      {/* Action Buttons */}
      {selectedCatalog && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleDeleteCatalog}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Delete Catalog
          </button>
          {selectedSkus.length > 0 && (
            <button
              onClick={handleDeleteSkus}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Delete Selected SKUs
            </button>
          )}
          {/* Export Button */}
        {selectedSkus.length > 0 && (
          <button
            onClick={handleExportSkus}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-900 transition"
          >
            Export SKUs Data
          </button>
        )}
        </div>
      )}      

      {/* Display SKUs */}
      {selectedCatalog && filteredSKUs.length > 0 ? (
        <div className="grid grid-cols-6 gap-4">
          {filteredSKUs.map((sku) => (
            <div key={sku.id} className="border p-4 rounded-md shadow-md bg-white">
              <input
                type="checkbox"
                checked={selectedSkus.includes(sku.id)}
                onChange={() => handleSkuSelect(sku.id)}
                className="mb-2 h-4 w-4"
              />
              <img src={sku.image} alt={sku.name} className="w-full h-24 object-cover mb-2 rounded-md" />
              {editingSku === sku.id ? (
                <>
                  <input
                    type="text"
                    value={editedSku.name}
                    onChange={(e) => setEditedSku({ ...editedSku, name: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="number"
                    value={editedSku.cpPrice}
                    onChange={(e) => setEditedSku({ ...editedSku, cpPrice: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="number"
                    value={editedSku.wsrPrice}
                    onChange={(e) => setEditedSku({ ...editedSku, wsrPrice: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <button
                    onClick={handleSaveClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{sku.name}</h3>
                  <p className="text-sm text-gray-700">CP Price: <strong>${sku.cpPrice}</strong></p>
                  <p className="text-sm text-gray-700">WSR Price: <strong>${sku.wsrPrice}</strong></p>
                  <button
                    onClick={() => handleEditClick(sku)}
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Edit SKU
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        selectedCatalog && <p className="text-gray-500">No SKUs available for this catalog.</p>
      )}
    </div>
  );
}