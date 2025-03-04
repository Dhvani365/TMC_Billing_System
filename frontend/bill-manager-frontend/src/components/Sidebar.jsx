import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@radix-ui/react-separator";
import { setSelectedBrand } from "@/store/brandSlice";

const Sidebar = () => {
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const clientBrands = useSelector((state) => state.client.clientBrands);
  const brands = selectedClient ? clientBrands[selectedClient] || [] : [];

  const [activebrand, setActivebrand] = useState("");
  const dispatch = useDispatch();

  // Update activebrand when brands change
  useEffect(() => {
    if (brands.length > 0) {
      setActivebrand(brands[0]); // Set first brand as active
    } else {
      setActivebrand(""); // Reset if no brands exist
    }
  }, [brands]);

  return (
    <aside className="w-[10%] bg-[#EEEEEE] h-screen p-2 shadow-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4 mt-2">Brands</h2>

      {selectedClient ? (
        <ul>
          <Separator className="bg-gray-700 w-full h-px my-2" />
          {brands.map((brand, index) => (
            <React.Fragment key={index}>
              <li
                className={`p-3 rounded-md cursor-pointer transition ${
                  activebrand === brand
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => {
                  dispatch(setSelectedBrand(brand))
                  setActivebrand(brand);
                }}
              >
                {brand}
              </li>
              <Separator className="bg-gray-700 w-full h-px my-2" />
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Select a client to see catalogs.</p>
      )}
    </aside>
  );
};

export default Sidebar;
