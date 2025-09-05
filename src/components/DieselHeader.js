import React from "react";

const DieselHeader = () => {
    return (
        <div className="dashboard-header">
            {/* <h1 className="dashboard-title">Diesel Dashboard</h1> */}
            <div className="header-cards">
                {/* Generator Info */}
                <div className="header-card generator-card">
                    <span className="card-icon"><img src="/electric-generator_2695268 1.png" alt="Logo" /></span>
                    <p className="card-label" style={{fontSize: '2rem'}}>Generators</p>
                    <div style={{marginTop: 8}}>
                        <p className="card-value">
                            <span className="status-dot"></span> Gen 001 1500 kVA
                            <p>Last posted:  <span className="value-red">20Hours ago</span></p>
                        </p>
                    </div>
                </div>

                {/* CO Emission */}
                <div className="header-card emission-card">
                    <span className="card-icon"><img src="/Vector.png" alt="Logo" /></span>
                    <div style={{marginLeft: 20}}>
                        <p className="card-label" style={{fontSize: '1.2rem'}}>CO emission</p>
                        <p className="card-value highlight">2.85 <span style={{color:'black'}}>tons</span></p>
                    </div>
                </div>

                {/* Price / Diesel Info */}
                <div className="header-card price-card">
                    <span className="card-icon"><img src="/i-gun.png" alt="Logo" /></span>
                    <div style={{marginLeft: 40}}>
                        <p className="card-label">Price / Litre</p>
                        <p className="card-label">Diesel efficiency</p>
                        <p className="card-label">Cost (monthly est.)</p>
                    </div>
                    <div style={{marginLeft: 60}}>
                        <p className="card-value highlight">₦ 1100</p>
                        <p className="card-value" style={{color:'#52AC0B'}}>3.50 kWh/L</p>
                        <p className="card-value highlight">₦ 39600</p>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DieselHeader;