import React from "react";

const OperationalEfficiencyCard = () => {
  return (
    <div className="card operational-efficiency-card">
      <h3 className="card-title">Operational efficiency</h3>

      <div className="op-cards-grid">
        {/* Fuel Efficiency */}
        <div className="op-card">
          <span className="label">Fuel efficiency</span>
          <span className="value-red">3.22 kWh/L</span>
        </div>

        {/* Power Demand */}
        <div className="op-card">
          <span className="label">Power demand</span>
          <div className="power-values">
            <div className="power-badge">
              <span className="sub-label">MAX •</span>
              <span className="badge green">575.04 kVA</span>
            </div>
            <div className="power-badge">
              <span className="sub-label">AVG •</span>
              <span className="badge blue">301.895 kVA</span>
            </div>
            <div className="power-badge">
              <span className="sub-label">MIN •</span>
              <span className="badge orange">28.75 kVA</span>
            </div>
          </div>
        </div>

        {/* Specific Fuel Consumption */}
        <div className="op-card">
          <span className="label">Specific fuel consumption</span>
          <span className="value-red">263 mL/kWh</span>
        </div>

        {/* Generator Efficiency Score */}
        <div className="op-card">
          <span className="label">Generator efficiency score</span>
          <span className="value-green" style={{fontSize: 18}}>38</span>
        </div>
      </div>
    </div>
  );
};

export default OperationalEfficiencyCard;