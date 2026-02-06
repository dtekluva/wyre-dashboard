// src/components/SummaryCard.jsx
import React from "react";

const SummaryCard = ({ title, value, children }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-center items-center">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default SummaryCard;