import React from "react";

const CostAnalysisCard = () => {
  return (
    <div className="card cost-analysis-card">
      <h3 className="card-title">Cost analysis</h3>

      <div className="cost-row">
        <div className="cost-label">Total cost</div>
        <div className="divider" />
        <div className="cost-value purple">₦ 25,500</div>
      </div>

      <div className="cost-row">
        <div className="cost-label">Blended cost (kWh)</div>
        <div className="divider" />
        <div className="cost-value purple">₦ 223.68</div>
      </div>

      <div className="cost-row">
        <div className="cost-label">Annual cost</div>
        <div className="divider" />
        <div className="cost-value purple">₦ 1,224,000</div>
      </div>
    </div>
  );
};

export default CostAnalysisCard;