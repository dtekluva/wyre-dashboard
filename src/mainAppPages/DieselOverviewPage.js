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
import { connect, useSelector } from "react-redux";
import { fetchBranchGeneratorMonthlyEnergyData, fetchBranchGeneratorsStatusData, fetchDieselPriceData } from "../redux/actions/diesel/diesel.action";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "#", name: "Diesel Overview", id: 2 },
];

const DieselOverviewPage = ({ fetchBranchGeneratorsStatusData, fetchBranchGeneratorMonthlyEnergyData, fetchDieselPriceData }) => {
  const [branchGenStatusData, setBranchGenStatusData] = useState(null);
  const [branchGenMonthlyEnergyData, setBranchGenMonthlyEnergyData] = useState({});
  const [dieselPriceData, setDieselPriceData] = useState({});

  const dieselPageData = useSelector((state) => state.dieselReducer);
  console.log('Diesel Reducer-----> ', dieselPageData);
  console.log('branchGenStatusData-----> ', branchGenStatusData);
  console.log('branchGenMonthlyEnergyData-----> ', branchGenMonthlyEnergyData);
  console.log('dieselPriceData-----> ', dieselPriceData);
  

  useEffect(() => {
    fetchBranchGeneratorsStatusData()
    fetchBranchGeneratorMonthlyEnergyData()
    fetchDieselPriceData()
  }, []);

  useEffect(() => {
    setBranchGenStatusData(dieselPageData.costTrackerOverviewData);
    setBranchGenMonthlyEnergyData(dieselPageData.dieselOverviewData);
    setDieselPriceData(dieselPageData.utilityOverviewData);
  }, [dieselPageData]);
  return (
    <div className="diesel-">
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      <DieselHeader />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 0 15px 0' }}>
        <DatePicker />
      </div>
      <div className="diesel-grid1">
        <div className="grid1-item">
          <TotalEnergyUsed />
        </div>
        <div className="grid1-item">
          <GeneratorStatus2 />
        </div>
      </div>
      <div className="diesel-grid2">
        <FuelUsageBreakupCard />
        <FuelUsageCard />
      </div>
      <div className="diesel-grid3">
        <OperationalEfficiencyCard />
        <CostAnalysisCard />
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  fetchBranchGeneratorsStatusData,
  fetchBranchGeneratorMonthlyEnergyData,
  fetchDieselPriceData
};

const mapStateToProps = (state) => ({
  diesel: state.dieselReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(DieselOverviewPage);