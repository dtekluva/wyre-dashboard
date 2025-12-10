// src/components/GeneratorCard.jsx
import React from "react";
import { dieselData } from "../data/dieselData";

const GeneratorCard = () => {
  const { generators, summary } = dieselData;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-3xl">🔌</span>
        <div>
          <h2 className="font-semibold text-lg">Generators</h2>
          <p className="text-sm text-gray-600">{generators[0].name}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">Price/Litre</p>
        <p className="text-lg font-semibold text-red-500">₦ {summary.pricePerLitre}</p>
        <p className="text-sm text-gray-500">Energy/Litre: {summary.energyPerLitre} kWh/L</p>
        <p className="text-sm text-gray-500">Cost (Daily est.): ₦ {summary.estimatedDailyCost}</p>
      </div>
    </div>
  );
};

export default GeneratorCard;