import React, { useEffect, useState, } from "react";
import { numberFormatter } from "../../helpers/numberFormatter";
import DashboardSmallBannerSection from "../../smallComponents/DashboardSmallBannerSection";

// // Tooltips
// import { Tooltip } from 'antd';
// import InformationIcon from '../../icons/InformationIcon';
// import DASHBOARD_TOOLTIP_MESSAGES from '../../components/toolTips/Dashboard_Tooltip_Messages';



const CarbonEmmission = ({ totalEnergyBranchData, userData }) => {
    const [carbonEmissionEnergyData, setCarbonEmissionEnergyData] = useState({});
    
    useEffect(() => {
        const carbonEmisionData = { dashboard_carbon_emissions: {}, cost_of_energy: {} }
        totalEnergyBranchData.devices.forEach(data => {
            const dashboard = data.dashboard;
            carbonEmisionData.dashboard_carbon_emissions.value = dashboard.dashboard_carbon_emissions.value + (carbonEmisionData.dashboard_carbon_emissions.value || 0);
            carbonEmisionData.dashboard_carbon_emissions.unit = dashboard.dashboard_carbon_emissions.unit;
            carbonEmisionData.cost_of_energy.value = dashboard.cost_of_energy.value + (carbonEmisionData.cost_of_energy.value || 0);
            carbonEmisionData.cost_of_energy.unit = dashboard.cost_of_energy.unit;
        });
        setCarbonEmissionEnergyData(carbonEmisionData)


    }, [totalEnergyBranchData]);

    return (
        <article className="dashboard__cost-emissions-banner dashboard__banner--small">
            <DashboardSmallBannerSection
                name="Carbon Emissions"
                value={
                    carbonEmissionEnergyData.dashboard_carbon_emissions &&
                    carbonEmissionEnergyData.dashboard_carbon_emissions.value.toFixed(2)
                }
                unit={
                    carbonEmissionEnergyData.dashboard_carbon_emissions && carbonEmissionEnergyData.dashboard_carbon_emissions.unit
                }
            />
            <DashboardSmallBannerSection
                name="Blended Cost of Energy"
                value={
                    carbonEmissionEnergyData.cost_of_energy &&
                    carbonEmissionEnergyData.cost_of_energy.value
                }
                // unit={cost_of_energy && cost_of_energy.unit}
                unit={carbonEmissionEnergyData.cost_of_energy && carbonEmissionEnergyData.cost_of_energy.unit}
            />
        </article>
    );
}

export default CarbonEmmission;
