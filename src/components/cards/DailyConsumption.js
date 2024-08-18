import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../../components/toolTips/Dashboard_Tooltip_Messages';
import DashboardDoughnutChart from "../pieCharts/DashboardDoughnutChart";
import DashboardStackedBarChart from "../barCharts/DashboardStackedBarChart";



const DailyConsumption = ({ totalDailyConsumptionBranchData, uiSettings, sideDetails}) => {

    return (
        <article className="dashboard-row-2 dashboard-bar-container">
          <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20, marginLeft: "auto" }}>
            <Tooltip placement="top" style={{ textAlign: "right" }}
              overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.DAILY_ENERGY} >
              <p>
                <InformationIcon className="info-icon" />
              </p>
            </Tooltip>
          </div>
          <DashboardStackedBarChart
            uiSettings={uiSettings}
            className=""
            data={totalDailyConsumptionBranchData}
            sideBarData={sideDetails.sideBarData}
          />
        </article>
    );
}

export default DailyConsumption;
