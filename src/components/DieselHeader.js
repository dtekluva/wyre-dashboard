import { Spin } from "antd";
import React from "react";

const DieselHeader = ({ dieselPrice, genStatus, Co2, loader }) => {
  
  return (
    <div className="dashboard-header">
      <div className="header-cards">
        {/* Generator Info */}
        <Spin spinning={loader.branchGeneratorsStatusLoading}>
          <div className="header-card generator-card">
            <div className="gen-left">
              <span className="card-icon">
                <img src="/electric-generator_2695268 1.png" alt="Logo" />
              </span>
            </div>
            <div className="gen-center">
              <p className="card-label title">Generators</p>
            </div>
            <div className="gen-right">
              <p className="card-value">
                <span className="status-dot"></span> Gen 001 1500 kVA
              </p>
              <p className="last-posted">
                Last used <span className="value-red">20 Hours ago</span>
              </p>
            </div>
          </div>
        </Spin>

        {/* CO Emission */}
        <div className="header-card emission-card">
          <span className="card-icon">
            <img src="/Vector.png" alt="Logo" />
          </span>
          <div className="emission-info">
            <p className="card-label">CO emission</p>
            <Spin spinning={loader.co2EmissionLoading}>
              <p className="card-value highlight">
                {Co2?.data?.total_co2_tonnes} <span className="unit">tons</span>
              </p>
            </Spin>
          </div>
        </div>

        {/* Price / Diesel Info */}
        
        <div className="header-card price-card">
          <div className="price-left">
            <span className="card-icon">
              <img src="/i-gun.png" alt="Logo" />
            </span>
          </div>
          <div className="price-center">
            <p className="card-label">Price / Litre</p>
            <p className="card-label">Diesel efficiency</p>
            <p className="card-label">Cost (Estimated monthly)</p>
          </div>
          <Spin spinning={loader.dieselPriceLoading}>
            <div className="price-right">
              <p className="card-value highlight">₦ {dieselPrice.diesel_price_per_litre}</p>
              <p className="card-value green">{dieselPrice.diesel_efficiency} kWh/L</p>
              <p className="card-value highlight">₦ {dieselPrice.month_estimated_cost}</p>
            </div>
          </Spin>
        </div>
        {/* </Spin> */}
      </div>
    </div>
  );
};

export default DieselHeader;