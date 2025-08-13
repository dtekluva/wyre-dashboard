import React, { useEffect, useContext, useState } from "react";
import { connect, useSelector } from "react-redux";

import CompleteDataContext from "../Context";
import BreadCrumb from "../components/BreadCrumb";
import CostTrackerMonthlyCostBarChart from "../components/barCharts/CostTrackerMonthlyCostBarChart";
import DieselOverviewCostTrackerTable from "../components/tables/DieselOverviewCostTrackerTable";
import UtilityOverviewCostTrackerTable from "../components/tables/UtilityOverviewCostTrackerTable";
import IppOverviewCostTrackerTable from "../components/tables/IppOverviewCostTrackerTable";
import DieselPurchasedTable from "../components/tables/DieselPurchasedTable";
import UtilityPurchasedTable from "../components/tables/UtilityPurchasedTable";
import {
  fetchFuelConsumptionData,
  getCostTrackerBaselineData,
  getCostTrackerOverviewData,
  getDieselOverviewData,
  getUtilityOverviewData,
} from "../redux/actions/constTracker/costTracker.action";
import { allCostTrackerBranchesBaseline } from "../helpers/genericHelpers";
import EnergyConsumptionMultipleChart from "../components/barCharts/EnergyConsumptionMultipleChart";
import Loader from "../components/Loader";

// Tooltips
import { Modal, Tooltip } from "antd";
import InformationIcon from "../icons/InformationIcon";
import { COST_TRACKER_TOOLTIP_MESSAGES } from "../components/toolTips/Cost_Tracker_Tooltip_Messages";
import AddBills from "./AddBills";
import UpdateDieselPurchase from "./UpdateDieselPurchase";
import UpdateUtilityPayment from "./UpdateUtilityPayment";
import IppPurchasedTable from "../components/tables/IppPurchasedTable";
import UpdateIppPayment from "./UpdateIppPayment";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "#", name: "Cost Tracker", id: 2 },
];

function CostTracker({
  match,
  getCostTrackerOverviewData,
  getDieselOverviewData,
  getUtilityOverviewData,
  getCostTrackerBaselineData,
  fetchFuelConsumptionData: fetchFuelConsumptionInfo,
}) {
  const [costTrackerOverviewData, setCostTrackerOverviewData] = useState([]);
  const [dieselOverviewData, setDieselOverviewData] = useState([]);
  const [utilityOverviewData, setUtilityOverviewData] = useState([]);
  const [ippOverviewData, setIppOverviewData] = useState([]);
  const [costTrackerBaselineData, setCostTrackerBaselineData] = useState([]);
  const [branchInfo, setBranchInfo] = useState(false);
  const [baseLineData, setBaseLineData] = useState(false);
  const [dieselEntryData, setDieselEntryData] = useState({});
  const [dieselPurchaseData, setDieselPurchaseData] = useState({});
  const [utilityPurchaseData, setUtilityPurchaseData] = useState({});
  const [ippPurchaseData, setIppPurchaseData] = useState({});
  const [editDieselPurchaseModal, setEditDieselPurchaseModal] = useState(false);
  const [editUtilityPurchaseModal, setEditUtilityPurchaseModal] =
    useState(false);
  const [editIppPurchaseModal, setEditIppPurchaseModal] = useState(false);
  const costTracker = useSelector((state) => state.costTracker);
  const sideBar = useSelector((state) => state.sideBar);

  const subHeaderStyle = {
    marginLeft: "20px",
    fontSize: "1.8rem",
    fontWeight: "500",
    marginTop: "20px",
  };

  const { setCurrentUrl, uiSettings, userData } =
    useContext(CompleteDataContext);

  const branchId =
    sideBar?.sideBarData?.branches &&
    sideBar?.sideBarData?.branches[0]?.branch_id;

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, []);

  useEffect(() => {
    if (branchId) {     
      getCostTrackerOverviewData(branchId);
      getDieselOverviewData(branchId);
      getUtilityOverviewData(branchId);
      getCostTrackerBaselineData(branchId);
    }
  }, [branchId]);

  useEffect(() => {
    setCostTrackerOverviewData(costTracker.costTrackerOverviewData);
    setDieselOverviewData(costTracker.dieselOverviewData);
    setUtilityOverviewData(costTracker.utilityOverviewData);
    setCostTrackerBaselineData(costTracker.CostTrackerBaselineData);
  }, [costTracker]);

  useEffect(() => {
    const getBranchOverviewData = [
      [
        costTrackerOverviewData.branch_name,
        {
          diesel: costTrackerOverviewData.branch_data?.diesel || [],
          utility: costTrackerOverviewData.branch_data?.utility || [],
        }
      ]
    ];
    const getBaselineData = [
      [
        costTrackerBaselineData.branch_name,
        {
          baseline: costTrackerBaselineData?.baseline || [],
        }
      ]
    ];
    
    if (getBranchOverviewData && getBranchOverviewData[0]) {
      setBranchInfo(getBranchOverviewData);
    }
    if (getBaselineData &&getBaselineData[0]) {
      setBaseLineData(
        allCostTrackerBranchesBaseline(sideBar?.selectedSideBar, getBaselineData)
      );
    }
  }, [costTrackerOverviewData, costTrackerBaselineData, sideBar.selectedSideBar]);

  const DieselOverViewCharts = dieselOverviewData && (
    <article>
      <h3 className="cost-tracker-branch-name">Cost Overview</h3>
      <div className="doughnut-card-heading">
        <p style={subHeaderStyle}>Diesel Overview</p>
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.DIESEL_OVERVIEW}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
      </div>
      <DieselOverviewCostTrackerTable
        isLoading={costTracker?.fetchDieselOverviewLoading}
        dieselOverviewData={dieselOverviewData?.diesel_overview}
        setDieselEntryData={setDieselEntryData}
        dieselEntryData={dieselEntryData}
        userId={userData.user_id}
        role={userData.role_text}
        fetchFuelConsumptionInfo={fetchFuelConsumptionInfo}
      />
    </article>
  );

  const UtilityOverViewCharts = utilityOverviewData && (
    <article className="cost-tracker-chart-container">
      <div className="doughnut-card-heading">
        <p style={subHeaderStyle}>Utility Overview</p>
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.UTILITY_OVERVIEW}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
      </div>
      <UtilityOverviewCostTrackerTable
        isLoading={costTracker?.fetchUtilityOverviewLoading}
        dataSource={utilityOverviewData?.utility_overview}
      />
    </article>
  );

  const IppOverViewCharts = ippOverviewData && (
    <article className="cost-tracker-chart-container">
      <div className="doughnut-card-heading">
        <p style={subHeaderStyle}>IPP Overview</p>
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.UTILITY_OVERVIEW}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
      </div>
      <IppOverviewCostTrackerTable
        isLoading={costTracker?.fetchIppOverviewLoading}
        dataSource={ippOverviewData?.ipp_overview}
      />
    </article>
  );

  const DieselPurchasedCharts =
    branchInfo &&
    branchInfo.length > 0 &&
    branchInfo.map((e, index) => (
      <article className="cost-tracker-chart-container" key={index}>
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.DIESEL_PURCHASED}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
        <h3 className="cost-tracker-branch-name">
          Diesel Purchased for {e[0]}
        </h3>

        <DieselPurchasedTable
          key={index}
          isLoading={costTracker.fetchCostTrackerLoading}
          data={e[1].diesel}
          role={userData.role_text}
          userId={userData.user_id}
          setEditDieselPurchaseModal={setEditDieselPurchaseModal}
          setDieselPurchaseData={setDieselPurchaseData}
        />
        <Modal
          visible={editDieselPurchaseModal}
          onOk={() => setEditDieselPurchaseModal(false)}
          onCancel={() => setEditDieselPurchaseModal(false)}
          width={1000}
          footer={null}
        >
          <UpdateDieselPurchase
            setModal={setEditDieselPurchaseModal}
            dieselPurchaseData={dieselPurchaseData}
          />
        </Modal>
      </article>
    ));

  const utilityPurchasedCharts =
    branchInfo &&
    branchInfo.map((e, index) => (
      <article className="cost-tracker-chart-container" key={index}>
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.UTILITY_PAYMENTS}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
        <h3 className="cost-tracker-branch-name">
          Utility Payments for {e[0]}
        </h3>

        <UtilityPurchasedTable
          key={index}
          isLoading={costTracker.fetchCostTrackerLoading}
          data={e[1].utility}
          userId={userData.user_id}
          role={userData.role_text}
          setEditUtilityPurchaseModal={setEditUtilityPurchaseModal}
          setUtilityPurchaseData={setUtilityPurchaseData}
        />

        <Modal
          visible={editUtilityPurchaseModal}
          onOk={() => setEditUtilityPurchaseModal(false)}
          onCancel={() => setEditUtilityPurchaseModal(false)}
          width={1000}
          footer={null}
        >
          <UpdateUtilityPayment
            utilityPurchaseData={utilityPurchaseData}
            setModal={setEditUtilityPurchaseModal}
          />
        </Modal>
      </article>
    ));

  const IppPurchasedCharts =
    branchInfo &&
    branchInfo.map((e, index) => (
      <article className="cost-tracker-chart-container" key={index}>
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.IPP_PAYMENTS}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
        <h3 className="cost-tracker-branch-name">IPP Payments for {e[0]}</h3>

        <IppPurchasedTable
          key={index}
          isLoading={costTracker.fetchCostTrackerLoading}
          data={e[1].ipp}
          userId={userData.user_id}
          setEditIppPurchaseModal={setEditIppPurchaseModal}
          setIppPurchaseData={setIppPurchaseData}
        />

        <Modal
          visible={editIppPurchaseModal}
          onOk={() => setEditIppPurchaseModal(false)}
          onCancel={() => setEditIppPurchaseModal(false)}
          width={1000}
          footer={null}
        >
          <UpdateIppPayment
            ippPurchaseData={ippPurchaseData}
            setModal={setEditIppPurchaseModal}
          />
        </Modal>
      </article>
    ));

  const monthlyCostBarCharts =
    branchInfo &&
    branchInfo.length > 0 &&
    [branchInfo[0]].map((e, index) => (
      <article key={index} className="cost-tracker-chart-container">
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.BASELINE_TRACKER}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
        <h3 className="cost-tracker-branch-name">
          Energy Consumption at {e[0]}
        </h3>
        <div className="cost-tracker-chart-wrapper">
          <EnergyConsumptionMultipleChart
            uiSettings={uiSettings}
            energyData={baseLineData}
          />
        </div>
      </article>
    ));

  const monthlyEnergyConsumptionBarCharts =
    branchInfo &&
    branchInfo.length > 0 &&
    [branchInfo[0]].map((e, index) => (
      <article key={index} className="cost-tracker-chart-container">
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20 }}>
          <Tooltip
            placement="top"
            style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={COST_TRACKER_TOOLTIP_MESSAGES.MONTHLY_COST}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
        <h3 className="cost-tracker-branch-name">Monthly Cost at {e[0]}</h3>
        <div className="cost-tracker-chart-wrapper">
          <CostTrackerMonthlyCostBarChart
            uiSettings={uiSettings}
            DieselData={e[1].diesel}
            utilityData={e[1].utility}
          />
        </div>
      </article>
    ));

  if (costTracker.fetchCostTrackerLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      <div></div>
      <section className="cost-tracker-chart-container">
        <h2 className="h-screen-reader-text">Cost Overview</h2>
        {DieselOverViewCharts}
        {UtilityOverViewCharts}
        {/* {IppOverViewCharts} */}
        {userData && userData.client_type == "RESELLER"
          ? IppOverViewCharts
          : ""}
      </section>

      <section className="cost-tracker-section">
        <h2 className="h-screen-reader-text">Quantity of Diesel Purchased</h2>
        {DieselPurchasedCharts}
      </section>

      <section className="cost-tracker-section">
        <h2 className="h-screen-reader-text">Quantity of Utility Payments</h2>
        {utilityPurchasedCharts}
      </section>

      {userData && userData.client_type == "RESELLER" ? (
        <section className="cost-tracker-section">
          <h2 className="h-screen-reader-text">Quantity of IPP Payments</h2>
          {IppPurchasedCharts}
        </section>
      ) : (
        ""
      )}

      <section className="cost-tracker-section">
        <h2 className="h-screen-reader-text">Monthly Cost</h2>
        {monthlyCostBarCharts}
      </section>

      <section className="cost-tracker-section">
        <h2 className="h-screen-reader-text">Monthly Cost</h2>
        {monthlyEnergyConsumptionBarCharts}
      </section>
    </>
  );
}

const mapDispatchToProps = {
  getCostTrackerOverviewData,
  getDieselOverviewData,
  getUtilityOverviewData,
  getCostTrackerBaselineData,
  fetchFuelConsumptionData,
};

export default connect(null, mapDispatchToProps)(CostTracker);
