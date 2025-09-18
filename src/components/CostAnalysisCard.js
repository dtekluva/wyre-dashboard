import { Spin } from "antd";
import React from "react";

const CostAnalysisCard = ({ costAnalysisData, loader }) => {

  return (
    <div className="card cost-analysis-card">
      <Spin spinning={loader}>
        <h3 className="card-title" style={{ textAlign: "center", marginBottom: "" }}>Cost analysis</h3>

        <div className="cost-row" style={{ marginTop: 25 }}>
          <div className="cost-label">Total cost</div>
          <div className="divider" />
          <div className="cost-value purple">₦ {costAnalysisData?.data?.total_cost.value}</div>
        </div>

        <div className="cost-row">
          <div className="cost-label">Blended cost (kWh)</div>
          <div className="divider" />
          <div className="cost-value purple">₦ {costAnalysisData?.data?.blended_cost.value}</div>
        </div>

        <div className="cost-row">
          <div className="cost-label">Annual cost</div>
          <div className="divider" />
          <div className="cost-value purple">₦ {costAnalysisData?.data?.annual_cost_forecast
            .value}</div>
        </div>
      </Spin>
    </div>
  );
};

export default CostAnalysisCard;