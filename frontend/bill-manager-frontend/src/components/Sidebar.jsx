import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@radix-ui/react-separator";
import { setSelectedCatalog } from "@/store/catalogSlice";

const Sidebar = () => {
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const clientCatalogs = useSelector((state) => state.client.clientCatalogs);
  const categories = selectedClient ? clientCatalogs[selectedClient] || [] : [];

  const [activeCategory, setActiveCategory] = useState("");
  const dispatch = useDispatch();

  // Update activeCategory when categories change
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]); // Set first category as active
    } else {
      setActiveCategory(""); // Reset if no categories exist
    }
  }, [categories]);

  return (
    <aside className="w-[15%] bg-[#EEEEEE] h-screen p-2 shadow-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4 mt-2">Catalogs</h2>

      {selectedClient ? (
        <ul>
          <Separator className="bg-gray-700 w-full h-px my-2" />
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              <li
                className={`p-3 rounded-md cursor-pointer transition ${
                  activeCategory === category
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => {
                  dispatch(setSelectedCatalog(category))
                  setActiveCategory(category);
                }}
              >
                {category}
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
