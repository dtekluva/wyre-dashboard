export const SCORE_CARD_EXCLUDE_CLIENTS = ["Sapio Utilities"];

export const BESPOKE_ADD_LIST = {
  SCORE_CARD: ["Lennox Mall", "Sky View Beach", "Chicken Republic"],
  REPORT: ["Lennox Mall", "Chicken Republic"],
  LOAD_OVERVIEW: ["Lennox Mall", "Chicken Republic"],
  COST_TRACKER: ["Lennox Mall", "Chicken Republic"],
  BILLING: [""],
};

// export const DASHBOARD_TOOLTIP_MESSAGES = {
//   TOTAL_ENERGY: `Cumulative energy the building has used over the course of the month. Solar hours: the total amount of energy used during the time of day the sun is expected to be out 8am - 5pm.`,
//   MAX_MIN_AVERAGE: `This card shows the maximum, minimum and average power demand of the building. This can be used to adequately size generators or decide on efficient load operations.`,
//   DAILY_ENERGY: `This bar-chart displays the energy consumed daily for the month and details energy contributed by each source of energy. Toggle on each bar to see daily energy consumption data.`,
//   POWER_USAGE: `Number of hours each source of energy was utilized within.`,
//   TODAY_VS_YESTERDAY: `Details energy used yesterday against today.`,
// };
// export const COST_TRACKER_TOOLTIP_MESSAGES = {
//   DIESEL_OVERVIEW: `Tracks and verifies monthly diesel utilization.`,
//   UTILITY_OVERVIEW: `Tracks and verifies utility bill payments. `,
//   DIESEL_PURCHASED: `A register of diesel purchased at the facility.`,
//   UTILITY_PAYMENTS: `A register of diesel purchased at the facility.`,
//   BASELINE_TRACKER: `A comparison of Wyre’s baseline energy forecast against actual energy consumption.`,
//   MONTHLY_COST: `Bar chart detailing total cost of energy monthly.`,
// };

// export const SCORE_CARD_TOOLTIP_MESSAGES = {
//   CARBON: `Carbon footprint on all sources.

//     Diesel: 2.68kg of CO2 per liter Gas   : 0.549kg of CO2 per kWh
//     Grid   : 0.439kg of CO2 per kWh

//     A typical hardwood tree can absorb as much as 48 pounds of carbon dioxide per year.

//     Performance is scored according to energy baseline.`,

//   PEAK_RATIO: `Represents the disparity between peak and average power within a facility.

//     To optimize efficiency, the goal is to close the gap between both metrics.

//     The aim is to score as close to 1 as possible.`,

//   BASE_ENERGY: `This is an algorithm that forecasts energy consumption by benchmarking energy use, weather and number of days to set a baseline usage.

//     Baseline usage is compared to actual consumption to score energy performance.`,

//   SIZE_EFFICIENCY: `Generator Size Efficiency: This info-graph measures and scores the efficiency or inefficiency of the generator’s size in comparison to power demanded by the facility. `,

//   FUEL_EFFICIENCYL: `Fuel Efficiency: This is an average kWh/liter ratio derived from real data of diesel consumed in a facility.

//     The ratio is benchmarked against the ideal consumption of a well maintained and sized diesel generator.`,

//   OPERATING_TIME: `Operating Time: Reports each event and duration generators are operated outside official hours, the diesel consumed and cost in Naira.`

// };

export const ALL_SCORE_CARD_TOTAL_NAME = [
  "Forecast",
  "Peak",
  "Estimated Value",
];

export const CHART_BACKGROUD_COLOR = [
  "#FFC205",
  "#5C3592",
  "#00C7E6",
  "#FF3DA1",
  "#82ca9d",
  "#0A267A",
  "#ff9b3d",
  "#360259",
  "#0371b5",
  "#D90000",
  "#757575",
  "#FFE11A",
];

export const CHART_BORDER_COLOR = [
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
];

export const UPLOAD_PROPS = {
  progress: {
    strokeColor: {
      "0%": "#108ee9",
      "100%": "#87d068",
    },
    strokeWidth: 3,
    format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
  },
};
