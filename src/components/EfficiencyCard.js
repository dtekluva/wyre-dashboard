// src/components/EfficiencyCard.jsx
import React from "react";
import { dieselData } from "../data/dieselData";

const EfficiencyCard = () => {
  const { efficiency } = dieselData;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h3 className="font-semibold mb-3">Operational efficiency</h3>
      <p className="text-sm">Fuel efficiency: <span className="font-bold">{efficiency.fuelEfficiency} kWh/L</span></p>
      <p className="text-sm">Specific fuel consumption: <span className="font-bold">{efficiency.specificFuelConsumption} mL/kWh</span></p>
      <p className="text-sm">Generator efficiency score: <span className="font-bold">{efficiency.score}</span></p>
    </div>
  );
};

export default EfficiencyCard;