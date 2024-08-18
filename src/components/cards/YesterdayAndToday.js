import React, { useEffect, useState, } from "react";
import { numberFormatter } from "../../helpers/numberFormatter";
import DashboardDownArrow from "../../icons/DashboardDownArrow";
import DashboardUpArrow from "../../icons/DashboardUpArrow";


// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../../components/toolTips/Dashboard_Tooltip_Messages';



const YesterDayAndTodayCard = ({ totalEnergyBranchData, userData }) => {
    const [totalTodayYesterdayData, setTotalTodayYesterdayData] = useState({});

    useEffect(() => {
        const todayAndYesterday = { todayValue: 0, yesterdayValue: 0, isTodaysValueLessThanYesterdays: false,  }
        totalEnergyBranchData.devices && totalEnergyBranchData.devices.forEach(data => {
            const dashboard = data.dashboard;
            todayAndYesterday.todayValue = dashboard.today.value + (todayAndYesterday.todayValue || 0);
            todayAndYesterday.yesterdayValue = dashboard.yesterday.value + (todayAndYesterday.yesterdayValue || 0);
            todayAndYesterday.todayUnit = dashboard.today.unit;
            todayAndYesterday.yesterdayUnit = dashboard.yesterday.unit;
        });
        todayAndYesterday.isTodaysValueLessThanYesterdays = todayAndYesterday.todayValue < todayAndYesterday.yesterdayValue;
        setTotalTodayYesterdayData(todayAndYesterday)


    }, [totalEnergyBranchData]);



    return (
        <article className="dashboard-today-and-yesterday">
            <div className="today-usage">
                <div style={{ textAlign: "right", paddingRight: 20, position: "relative" }}>
                    <Tooltip placement="top" style={{ textAlign: "right" }}
                        overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.TODAY_VS_YESTERDAY} >
                        <p>
                            <InformationIcon className="info-icon" />
                        </p>
                    </Tooltip>
                </div>
                <h3 className="today-usage__heading">Today's Usage ({totalTodayYesterdayData.todayUnit})</h3>
                <div className="usage-value-and-arrow">
                    <p className="today-usage__value">
                        {numberFormatter(totalTodayYesterdayData.todayValue) || '0000'}
                    </p>
                    {totalTodayYesterdayData.isTodaysValueLessThanYesterdays ? (
                        <DashboardDownArrow />
                    ) : (
                        <DashboardUpArrow />
                    )}
                </div>
            </div>
            <div className="yesterday-usage">
                <h3 className="yesterday-usage__heading">
                    Yesterday's Usage (kWh)
                </h3>
                <div className="usage-value-and-arrow">
                    <p className="yesterday-usage__value">
                        {numberFormatter(totalTodayYesterdayData.yesterdayValue) || '0000'}
                    </p>
                    {totalTodayYesterdayData.isTodaysValueLessThanYesterdays ? (
                        <DashboardUpArrow />
                    ) : (
                        <DashboardDownArrow />
                    )}
                </div>
            </div>
        </article>
    );
}

export default YesterDayAndTodayCard;
