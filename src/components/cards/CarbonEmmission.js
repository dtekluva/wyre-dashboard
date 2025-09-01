import React, { useEffect, useState, } from "react";
import DashboardSmallBannerSection from "../../smallComponents/DashboardSmallBannerSection";



const CarbonEmmission = ({ totalEnergyBranchData, blendedCost, userData }) => {
    const [carbonEmissionEnergyData, setCarbonEmissionEnergyData] = useState({});
    
    useEffect(() => {
        const carbonEmisionData = { dashboard_carbon_emissions: {}, cost_of_energy: {} }
        totalEnergyBranchData && totalEnergyBranchData.devices && totalEnergyBranchData.devices.forEach(data => {
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
                    carbonEmissionEnergyData.dashboard_carbon_emissions.value?.toFixed(2)
                }
                unit={
                    carbonEmissionEnergyData.dashboard_carbon_emissions && carbonEmissionEnergyData.dashboard_carbon_emissions.unit
                }
            />
            <DashboardSmallBannerSection
                name="Blended Cost of Energy"
                value={
                    blendedCost
                }
                // unit={cost_of_energy && cost_of_energy.unit}
                unit={carbonEmissionEnergyData.cost_of_energy && carbonEmissionEnergyData.cost_of_energy.unit}
            />
        </article>
    );
}

export default CarbonEmmission;
