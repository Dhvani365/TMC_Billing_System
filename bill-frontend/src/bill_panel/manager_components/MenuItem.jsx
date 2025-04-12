import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/orderSlice";

const MenuItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="p-4 border rounded shadow-md cursor-pointer" onClick={() => dispatch(addItem(item))}>
      <h3 className="font-bold">{item.name}</h3>
      <p>₹{item.price}</p>
    </div>
  );
};

export default MenuItem;
