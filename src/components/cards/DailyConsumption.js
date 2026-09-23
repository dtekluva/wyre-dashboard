import React from "react";

// Tooltips
import { Spin, Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../../components/toolTips/Dashboard_Tooltip_Messages';
import DashboardStackedBarChart from "../barCharts/DashboardStackedBarChart";



const DailyConsumption = ({ totalDailyConsumptionBranchData, uiSettings, sideDetails, loading }) => {
  const hasChartData =
    Object.keys(sideDetails.sideBarData).length > 0 && !!totalDailyConsumptionBranchData;

  return (
    <article className="dashboard-row-2 dashboard-bar-container">
      <Spin spinning={!!loading}>
        <div className="dashboard-section-body">
          <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20, marginLeft: "auto" }}>
            <Tooltip placement="top" style={{ textAlign: "right" }}
              popupStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.DAILY_ENERGY} >
              <p>
                <InformationIcon className="info-icon" />
              </p>
            </Tooltip>
          </div>
          {hasChartData && (
            <div className="dashboard-bar-chart-wrapper">
              <DashboardStackedBarChart
                uiSettings={uiSettings}
                className=""
                data={totalDailyConsumptionBranchData}
                sideBarData={sideDetails.sideBarData}
              />
            </div>
          )}
        </div>
      </Spin>
    </article>
  );
}

export default DailyConsumption;
