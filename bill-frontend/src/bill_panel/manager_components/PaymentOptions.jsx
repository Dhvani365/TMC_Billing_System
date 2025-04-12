import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod } from "../store/paymentSlice";

const PaymentOptions = () => {
  const dispatch = useDispatch();
  const method = useSelector((state) => state.payment.method);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Payment Method</h2>
      {["Cash", "Card", "UPI", "Loyalty"].map((option) => (
        <button 
          key={option} 
          className={`px-4 py-2 mx-2 ${method === option ? "bg-green-500 text-white" : "bg-gray-300"}`}
          onClick={() => dispatch(setPaymentMethod(option))}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default PaymentOptions;
