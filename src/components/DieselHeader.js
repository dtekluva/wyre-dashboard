import { Spin } from "antd";
import React from "react";

const DieselHeader = ({ dieselPrice, genStatus, Co2, loader }) => {
  
  return (
    <div className="dashboard-header">
      <div className="header-cards">
        {/* Generator Info */}       
          <div className="header-card emission-card">
            <div className="gen-left">
              <span className="card-icon">
                <img src="/electric-generator_2695268 1.png" alt="Logo" />
              </span>
          </div>
          <div className="">
            <p className="card-label" style={{ fontSize: 20, marginLeft: 10 }}>
              {genStatus ? genStatus?.generators?.map((gen, index) => (
                <React.Fragment>
                  <Spin spinning={loader.branchGeneratorsStatusLoading}>
                    <div className="">
                      <p className="">
                        <span className={`status-dot ${gen.is_currently_on ? 'on' : ''}`}></span> {gen.name}
                      </p>
                      <p className="last-posted" style={{ fontSize: 14, marginLeft: 2 }}>
                        Last used <span className="value-red">{gen.last_usage_time_relative}</span>
                      </p>
                    </div>
                  </Spin>
                </React.Fragment>
              )) :
                'Generator'
              }
            </p>
          </div>
        </div>

        {/* CO Emission */}
        <div className="header-card emission-card">
          <span className="card-icon">
            <img width={60} src="/Vector.png" alt="Logo" />
          </span>
          <div className="emission-info" style={{marginLeft:10}}>
            <p className="card-label" style={{fontSize:20}}>CO emission</p>
            <Spin spinning={loader.co2EmissionLoading}>
              <p className="card-value highlight" style={{fontSize:20}}>
                {(Co2?.data?.total_co2_tonnes)?.toLocaleString()} <span className="unit">tons</span>
              </p>
            </Spin>
          </div>
        </div>

        {/* Price / Diesel Info */}
        
        <div className="header-card price-card">
          <div className="price-left" style={{marginRight:10}}>
            <span className="card-icon">
              <img width={40} src="/i-gun.png" alt="Logo" />
            </span>
          </div>
          <div className="price-center">
            <p className="card-label-price">Price / Litre</p>
            <p className="card-label-price">Diesel efficiency</p>
            <p className="card-label-price">Cost (Estimated monthly)</p>
          </div>
          <Spin spinning={loader.dieselPriceLoading}>
            <div className="price-right">
              <p className="card-value highlight">₦ {(dieselPrice.diesel_price_per_litre)?.toLocaleString()}</p>
              <p className="card-value green">{(dieselPrice.diesel_efficiency)?.toLocaleString()} kWh/L</p>
              <p className="card-value highlight">₦ {(dieselPrice.month_estimated_cost)?.toLocaleString()}</p>
            </div>
          </Spin>
        </div>
        {/* </Spin> */}
      </div>
    </div>
  );
};

export default DieselHeader;