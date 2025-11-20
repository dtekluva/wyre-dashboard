import { Spin } from "antd";
import React from "react";

const OperationalEfficiencyCard = ({ operationalEfficiencyData, loader }) => {
  
  return (
    <Spin spinning={loader}>
      <div className="card operational-efficiency-card">
        <h3 className="card-title">Operational efficiency</h3>
        <div className="efficiency-grid">
          {/* Fuel efficiency */}
          <div className="eff-item">
            <span className="eff-label">Fuel efficiency</span>
            <span className="eff-value red">{(operationalEfficiencyData?.data?.fuel_efficiency.value)?.toLocaleString()} kWh/L</span>
          </div>

          {/* Specific fuel consumption */}
          <div className="eff-item">
            <span className="eff-label">Specific fuel consumption</span>
            <span className="eff-value red">{(operationalEfficiencyData?.data?.fuel_consumption.value)?.toLocaleString()} mL/kWh</span>
          </div>

          {/* Generator efficiency score */}
          {/* Power demand */}
          <div className="eff-item power-demand">
            <span className="eff-label">Power demand</span>
            <div className="power-values">
              <div>
                <span className="sub-label">MAX •</span>
                <span className="value green">{(operationalEfficiencyData?.data?.power_demand_kva.max.value)?.toLocaleString()} kVA</span>
              </div>
              <div>
                <span className="sub-label">AVG •</span>
                <span className="value green">{(operationalEfficiencyData?.data?.power_demand_kva.avg.value)?.toLocaleString()} kVA</span>
              </div>
              <div>
                <span className="sub-label">MIN •</span>
                <span className="value green">{(operationalEfficiencyData?.data?.power_demand_kva.min.value)?.toLocaleString()} kVA</span>
              </div>
            </div>
          </div>
          <div className="eff-item">
            <span className="eff-label">Generator efficiency score</span>
            <span className="eff-value green big" style={{ fontSize: '4rem' }}>{operationalEfficiencyData?.data?.generator_efficiency_score.value}</span>
          </div>


        </div>
      </div>
    </Spin>
  );
};

export default OperationalEfficiencyCard;