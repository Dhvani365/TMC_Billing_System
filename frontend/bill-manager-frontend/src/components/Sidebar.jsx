import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@radix-ui/react-separator";
import { setSelectedBrand } from "@/store/brandSlice";
import axios from "axios";
import './Loader.css'; // Import the CSS file
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = () => {
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [loadingBrands, setLoadingBrands] = useState(false);
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
        setLoadingBrands(true);
        try {
          const response = await axios.get(`${BACKEND_URL}/party/${selectedClient._id}`, {
            withCredentials: true,
          });
          console.log("Fetched brands:", response.data);
          const extractedBrands = response.data.relations.map((relation) => relation.brand);
          setBrands(extractedBrands);
          // const extractedBrands = response.data.map((item) => item.brand); // Extract brand objects
          // setBrands(extractedBrands);
        } catch (error) {
          console.error("Error fetching brands:", error);
          setBrands([]);
        } finally {
          setTimeout(() => setLoadingBrands(false), 200); // Simulate loading delay
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
        loadingBrands ? (
          <div style={{marginTop: "-100%"}} className="loading-container">
            <div className="loader"></div>
          </div>
        ) : (
          brands.length > 0 ? (
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
            <p className="text-gray-500 italic">No brands exist for the selected client.</p>
          )
        )
      ) : (
        <p className="text-gray-500 italic">Select a client to see catalogs.</p>
      )}
    </aside>
  );
};

export default Sidebar;