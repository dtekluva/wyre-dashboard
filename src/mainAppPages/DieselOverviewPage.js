import React, { useEffect, useState } from "react";
import DieselHeader from "../components/DieselHeader";
import GeneratorStatus2 from "../components/GeneratorStatus2";
import TotalEnergyUsed from "../components/TotalEnergyUsed";
import FuelUsageBreakupCard from "../components/FuelUsageBreakupCard";
import FuelUsageCard from "../components/FuelUsageCard";
import OperationalEfficiencyCard from "../components/OperationalEfficiencyCard";
import CostAnalysisCard from "../components/CostAnalysisCard";
import BreadCrumb from "../components/BreadCrumb";
import { DatePicker } from "antd";
import { connect } from "react-redux";
import { fetchBranchGeneratorsStatusData, fetchCoEmissionData, fetchCostMetricsData, fetchDieselPriceData, fetchFuelUsageData, fetchGenFuelUsageData, fetchGenMetricsData, fetchGenStatusChartData, fetchGenTotalEnergyUsedData } from "../redux/actions/diesel/diesel.action";
import dayjs from "dayjs";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "#", name: "Diesel Overview", id: 2 },
];

const DieselOverviewPage = ({ 
  diesel, 
  fetchBranchGeneratorsStatusData, 
  fetchGenTotalEnergyUsedData, 
  fetchDieselPriceData, 
  fetchCoEmissionData, 
  fetchCostMetricsData,
  fetchFuelUsageData,
  fetchGenFuelUsageData,
  fetchGenStatusChartData,
  fetchGenMetricsData

}) => {
  const [branchGenStatusData, setBranchGenStatusData] = useState(null);
  const [genCo2EmissionData, setGenCo2EmissionData] = useState(null);
  const [dieselPriceData, setDieselPriceData] = useState({});
  const [genTotalEnergyUsedData, setGenTotalEnergyUsedData] = useState(null);
  const [genStatusChartData, setGenStatusChartData] = useState(null);
  const [genFuelUsageData, setGenFuelUsageData] = useState(null);
  const [fuelUsageData, setFuelUsageData] = useState(null);
  const [operationalEfficiencyData, setOperationalEfficiencyData] = useState(null);
  const [costAnalysisData, setCostAnalysisData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!selectedDate) return;
    fetchBranchGeneratorsStatusData(selectedDate)
    fetchGenTotalEnergyUsedData(selectedDate)
    fetchDieselPriceData(selectedDate)
    fetchCoEmissionData(selectedDate)
    fetchGenStatusChartData(selectedDate)
    fetchGenFuelUsageData(selectedDate)
    fetchFuelUsageData(selectedDate)
    fetchGenMetricsData(selectedDate)
    fetchCostMetricsData(selectedDate)
  }, [selectedDate]);

  useEffect(() => {
    if (diesel) {  
      setBranchGenStatusData(diesel.branchGeneratorsStatusData);
      setGenCo2EmissionData(diesel.co2EmissionData)
      setDieselPriceData(diesel.dieselPriceData);
      setGenTotalEnergyUsedData(diesel.branchGeneratorMonthlyEnergyData);
      setGenStatusChartData(diesel.genStatusChartData);
      setGenFuelUsageData(diesel.genFuelUsageData);
      setFuelUsageData(diesel.fuelUsageData);
      setOperationalEfficiencyData(diesel.operationalEfficiencyData);
      setCostAnalysisData(diesel.costAnalysisData);
    }
  }, [diesel]);

  return (
    <div className="diesel-">
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      <DieselHeader
        dieselPrice={dieselPriceData}
        genStatus={branchGenStatusData}
        Co2={genCo2EmissionData}
        loader={diesel}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 0 15px 0' }}>
        <DatePicker
          picker="month"
          value={dayjs(selectedDate)}
          onChange={(value) => {
            if (value) {
              setSelectedDate(value.toDate());
            }
          }}
        />
      </div>
      <div className="diesel-grid1">
        <div className="grid1-item">
          <TotalEnergyUsed 
            genTotalEnergyUsedData={genTotalEnergyUsedData}
            loader={diesel.branchGeneratorMonthlyEnergyLoading}
          />
        </div>
        <div className="grid1-item">
          <GeneratorStatus2 
            genStatusChartData={genStatusChartData}
            loader={diesel.genStatusChartLoading}
          />
        </div>
      </div>
      <div className="diesel-grid2">
        <FuelUsageBreakupCard 
          genFuelUsageData={genFuelUsageData}
          loader={diesel.genFuelUsageLoading}
        />
        <FuelUsageCard
          fetchFuelUsageData={fetchFuelUsageData}
          fuelUsageData={fuelUsageData}
          loader={diesel.genFuelUsageLoading}
        />
      </div>
      <div className="diesel-grid3">
        <OperationalEfficiencyCard 
          operationalEfficiencyData={operationalEfficiencyData}
          loader={diesel.operationalEfficiencyLoading}
        />
        <CostAnalysisCard 
          costAnalysisData={costAnalysisData}
          loader={diesel.costAnalysisLoading}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  fetchBranchGeneratorsStatusData,
  fetchGenTotalEnergyUsedData,
  fetchDieselPriceData,
  fetchCoEmissionData,
  fetchGenStatusChartData,
  fetchGenFuelUsageData,
  fetchFuelUsageData,
  fetchGenMetricsData,
  fetchCostMetricsData
};

const mapStateToProps = (state) => ({
  diesel: state.dieselReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(DieselOverviewPage);