import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@radix-ui/react-separator";
import { setSelectedBrand } from "@/store/brandSlice";
import axios from "axios";

const Sidebar = () => {
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (brands.length > 0) {
      setActiveBrand(brands[0]); // Set first brand as active
    } else {
      setActiveBrand(null); // Reset if no brands exist
    }
  }, [brands]);
  
  useEffect(() => {
    const fetchBrands = async () => {
      if (selectedClient) {
        try {
          const response = await axios.get(`http://localhost:3000/api/partyBrand/selected_brands/${selectedClient._id}`);
          console.log("==>", response);
          setBrands(response.data || []); // Ensure brands is always an array
        } catch (error) {
          console.error("Error fetching brands:", error);
          setBrands([]); // Set brands to an empty array on error
        }
      } else {
        setBrands([]);
      }
    };

    fetchBrands();
  }, [selectedClient]);

  useEffect(() => {
    const fetchBrands = async () => {
      if (selectedClient) {
        try {
          const response = await axios.get(`http://localhost:3000/api/partyBrand/${selectedClient._id}`);
          console.log("Fetched brands:", response.data);
          const extractedBrands = response.data.map((item) => item.brand); // Extract brand objects
          setBrands(extractedBrands);
        } catch (error) {
          console.error("Error fetching brands:", error);
          setBrands([]);
        }
      } else {
        setBrands([]);
      }
    };

    fetchBrands();
  }, [selectedClient]);

  return (
    <aside className="w-[10%] bg-[#EEEEEE] h-screen p-2 shadow-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4 mt-2">Brands</h2>

      {selectedClient ? (
        <ul>
          <Separator className="bg-gray-700 w-full h-px my-2" />
          {brands.map((brand) => (
            <React.Fragment key={brand._id}>
              <li
                className={`p-3 rounded-md cursor-pointer transition ${
                  activeBrand?._id === brand._id ? "bg-gray-700 text-white" : "hover:bg-gray-300"
                }`}
                onClick={() => {
                  dispatch(setSelectedBrand({ _id: brand._id, name: brand.name }));
                  setActiveBrand(brand);
                }}
              >
                {brand.name}
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
