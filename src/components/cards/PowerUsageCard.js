import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../../components/toolTips/Dashboard_Tooltip_Messages';
import DashboardDoughnutChart from "../pieCharts/DashboardDoughnutChart";



const PowerUsageCard = ({ totalDeviceUsageBranchData, uiSettings, sideDetails}) => {

    return (
        <article className="dashboard-pie-container">
        <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20, float: "right" }}>
          <Tooltip placement="top" style={{ textAlign: "right" }}
            overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.POWER_USAGE} >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>
        <DashboardDoughnutChart data={totalDeviceUsageBranchData} uiSettings={uiSettings} sideBarData={sideDetails.sideBarData} />
      </article>
    );
}

export default PowerUsageCard;
