import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../../components/toolTips/Dashboard_Tooltip_Messages';



const TotalEnergyCard = ({ totalEnergyBranchData, userData }) => {
    const [totalEnergyData, setTotalEnergyData] = useState({});

    useEffect(() => {
        const totalData = {total_kwh: {}, solar_hours: {}}
        totalEnergyBranchData && totalEnergyBranchData.devices && totalEnergyBranchData.devices.forEach(data => {           
            const dashboard = data.dashboard;
            if (data.is_source && data.source_tag=='AGGREGATORY') {
              totalData.total_kwh.value =
                dashboard.total_kwh.value + (totalData.total_kwh.value || 0);
              totalData.total_kwh.unit = dashboard.total_kwh.unit;
              totalData.solar_hours.value =
                dashboard.solar_hours.value +
                (totalData.solar_hours.value || 0);
              totalData.solar_hours.unit = dashboard.solar_hours.unit;
            }
        });
        setTotalEnergyData(totalData)


    }, [totalEnergyBranchData]);



    return (
        <article className="dashboard__total-energy dashboard__banner--small">
            <div style={{ textAlign: "right", paddingRight: 20, paddingTop: 20, marginLeft: "auto" }}>
                <Tooltip placement="top" style={{ textAlign: "right" }}
                    overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.TOTAL_ENERGY} >
                    <p>
                        <InformationIcon className="info-icon" style={{ color: "white" }} />
                    </p>
                </Tooltip>
            </div>
            <h2 className="total-energy__heading">Total Energy</h2>
            <p className="total-energy_value">
                <span>{totalEnergyData.total_kwh && numberFormatter(totalEnergyData.total_kwh.value)}</span>
                <span>{totalEnergyData.total_kwh && totalEnergyData.total_kwh.unit}</span>
            </p>
            {userData.client_type !== 'RESELLER' &&
                <p className="total-energy_value solar-energy_value">
                    <span>Solar Hours: {totalEnergyData.solar_hours && numberFormatter(totalEnergyData.solar_hours?.value)} </span>
                    <span>{totalEnergyData.solar_hours && 'kWh'}{'('}{((totalEnergyData.solar_hours?.value / totalEnergyData.total_kwh?.value) * 100)?.toFixed(2)}{'%)'}</span>
                </p>
            }
        </article>
    );
}

export default TotalEnergyCard;
