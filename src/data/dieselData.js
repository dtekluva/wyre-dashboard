// src/data/mockData.js
export const dieselData = {
  generators: [
    { id: "gen001", name: "Gen 001 1500 kVA", energyUsed: 65.1, fuelUsed: 10, runHours: "22h 09m 07s" },
    { id: "gen002", name: "Gen 002 2000 kVA", energyUsed: 48.9, fuelUsed: 25, runHours: "17h 50m 53s" },
  ],
  summary: {
    totalEnergy: 115,
    coEmission: "--",
    pricePerLitre: 850,
    energyPerLitre: 3.82,
    estimatedDailyCost: 4250,
  },
  cost: {
    totalCost: 25500,
    costPerKWh: 223.68,
    annualCost: "--",
  },
  efficiency: {
    fuelEfficiency: 74.88,
    specificFuelConsumption: 263,
    score: 38,
  },
  charts: {
    fuelBreakup: [
      { day: "Aug 4", gen001: 20, gen002: 15 },
      { day: "Aug 5", gen001: 40, gen002: 25 },
      { day: "Aug 6", gen001: 15, gen002: 25 },
      { day: "Aug 7", gen001: 50, gen002: 60 },
      { day: "Aug 8", gen001: 30, gen002: 25 },
    ],
    fuelUsage: [
      { day: "Aug 3", fuel: 0 },
      { day: "Aug 4", fuel: 3 },
      { day: "Aug 5", fuel: 5 },
      { day: "Aug 6", fuel: 5 },
      { day: "Aug 7", fuel: 5 },
      { day: "Aug 8", fuel: 4 },
    ],
  },
};

export const energyData = [
  { name: "Solar", value: 4000 },
  { name: "Grid", value: 3000 },
  { name: "Generator", value: 2000 },
];

export const runHoursData = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 6 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 7 },
  { day: "Sat", hours: 4 },
  { day: "Sun", hours: 6 },
];

export const fuelUsedData = [
  { month: "Jan", liters: 120 },
  { month: "Feb", liters: 150 },
  { month: "Mar", liters: 100 },
  { month: "Apr", liters: 180 },
  { month: "May", liters: 140 },
];
