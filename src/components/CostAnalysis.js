// src/components/CostAnalysis.jsx
import React from "react";
import { dieselData } from "../data/dieselData";

const CostAnalysis = () => {
  const { cost } = dieselData;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h3 className="font-semibold mb-3">Cost analysis</h3>
      <p className="text-sm">Total cost: <span className="font-bold">₦ {cost.totalCost}</span></p>
      <p className="text-sm">Cost per kWh: <span className="font-bold">₦ {cost.costPerKWh}</span></p>
      <p className="text-sm">Annual cost: <span className="font-bold">{cost.annualCost}</span></p>
    </div>
  );
};

export default CostAnalysis;