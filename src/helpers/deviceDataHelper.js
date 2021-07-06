
import {
    convertDateStringToObject,
    convertParameterDateStringsToObjects,
} from '../helpers/genericHelpers';


import {

    getModifiedBranchLevelData,
} from '../helpers/genericHelpers';



const getDeviceData = ({
    branchData,
    deviceData
}) => {

    const modifiedDeviceName = !deviceData.name.includes(branchData.name)
        ? branchData.name + ' ' + deviceData.name
        : deviceData.name;

    // Creates name with parent branch name removed
    const originalDeviceName = deviceData.name
        .replace(branchData.name, '')
        .trim();

    const deviceDailyKwh = {
        dates: branchData.daily_kwh.dates,
        [modifiedDeviceName]: branchData.daily_kwh[originalDeviceName],
    };

    const branchMonthlyUsage = branchData.usage_hours;
    const deviceIndex = branchMonthlyUsage.devices.indexOf(
        originalDeviceName
    );
    const deviceMonthlyUsage = {
        // Use modified device name
        devices: [
            branchData.name + ' ' + branchMonthlyUsage.devices[deviceIndex],
        ],
        hours: [branchMonthlyUsage.hours[deviceIndex]],
    };

    const deviceTimeOfUseTableData = getModifiedBranchLevelData(
        branchData,
        'time_of_use_table',
        branchData.name
    );

    const modifiedBranchCostTrackerDieselQuantityData = getModifiedBranchLevelData(
        branchData,
        'cost_tracker_qty_of_diesel',
        branchData.name
    );

    const modifiedBranchCostTrackerMonthlyCostData = getModifiedBranchLevelData(
        branchData,
        'cost_tracker_monthly_cost',
        branchData.name
    );

    const modifiedBranchCostTrackerConsumptionData = getModifiedBranchLevelData(
        branchData,
        'cost_tracker_consumption_breakdown',
        branchData.name
    );

    const modifiedBranchBillingTotalsData = getModifiedBranchLevelData(
        branchData,
        'billing_totals',
        branchData.name
    );

    const deviceBillingTotalsData = {
        ...modifiedBranchBillingTotalsData,
        present_total: { usage_kwh: 0, value_naira: 0 },
        previous_total: { usage_kwh: 0, value_naira: 0 },
        usage: {
            previous_kwh: 0,
            present_kwh: 0,
            total_usage_kwh: 0,
        },
        metrics: {
            diesel_per_kwh: 0,
            utility_per_kwh: 0,
            blended_cost_per_kwh: 0,
            unit: '₦',
        },
    }


    /* -------------------------------------------------------------------
    /* Dashboard Begins --------------------------------------------------
    --------------------------------------------------------------------*/
    // Destructure dashboard data for device
    const {
        total_kwh,
        min_demand,
        max_demand,
        avg_demand,
        dashboard_carbon_emissions,
        cost_of_energy,
        today,
        yesterday,
    } = deviceData.dashboard;
    /* -------------------------------------------------------------------
    /* Dashboard Ends ----------------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Score Card Begins -------------------------------------------------
    --------------------------------------------------------------------*/
    // Destructure score card data for device
    const {
        is_generator,
        baseline_energy,
        peak_to_avg_power_ratio,
        score_card_carbon_emissions,
        generator_size_efficiency,
        change_over_lags,
        operating_time,
        fuel_consumption,
    } = deviceData.score_card;

    // Add name to generator size efficiency & fuel consumption data
    if (generator_size_efficiency)
        generator_size_efficiency.name = modifiedDeviceName;
    if (fuel_consumption) fuel_consumption.name = modifiedDeviceName;
    /* -------------------------------------------------------------------
    /* Score Card Ends ---------------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Power Quality Begins ----------------------------------------------
    --------------------------------------------------------------------*/
    const powerQualityData = convertParameterDateStringsToObjects(
        deviceData,
        'power_quality'
    );
    // Add device name to data
    powerQualityData.deviceName = modifiedDeviceName;
    /* -------------------------------------------------------------------
    /* Power Quality Ends ------------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Last Reading Begins -----------------------------------------------
    --------------------------------------------------------------------*/
    const lastReadingData = Object.assign({}, deviceData.last_reading);
    lastReadingData.date = convertDateStringToObject(lastReadingData.date);
    lastReadingData.deviceName = modifiedDeviceName;
    /* -------------------------------------------------------------------
    /* Last Reading Ends -------------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Power Demand Begins -----------------------------------------------
    --------------------------------------------------------------------*/
    const powerDemandData = convertParameterDateStringsToObjects(
        deviceData,
        'power_demand'
    );
    const { dates: power_demand_dates, power_demand_values } = powerDemandData;
    if (power_demand_values) power_demand_values.source = modifiedDeviceName;
    /* -------------------------------------------------------------------
    /* Power Demand Ends -------------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Time of Use Begins ------------------------------------------------
    --------------------------------------------------------------------*/
    const timeOfUseChartData = convertParameterDateStringsToObjects(
        deviceData,
        'time_of_use'
    );
    if (timeOfUseChartData) timeOfUseChartData.deviceName = modifiedDeviceName;
    /* -------------------------------------------------------------------
    /* Time of Use Ends --------------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Energy Consumption Begins -------------------------------------------
    --------------------------------------------------------------------*/
    const energyConsumptionData = convertParameterDateStringsToObjects(
        deviceData,
        'energy_consumption'
    );

    const {
        dates: energy_consumption_dates,
        energy_consumption_values,
        previous: energy_consumption_previous,
        current: energy_consumption_current,
        usage: energy_consumption_usage,
    } = energyConsumptionData;

    if (energy_consumption_values)
        energy_consumption_values.deviceName = modifiedDeviceName;
    /* -------------------------------------------------------------------
    /* Energy Consumption Ends -------------------------------------------
    --------------------------------------------------------------------*/

    /* -------------------------------------------------------------------
    /* Billing Begins ----------------------------------------------------
    --------------------------------------------------------------------*/
    const { billing } = deviceData;

    const consumptionKwhWithoutName = convertParameterDateStringsToObjects(
        billing,
        'consumption_kwh'
    );
    const consumptionNairaWithoutName = convertParameterDateStringsToObjects(
        billing,
        'consumption_naira'
    );

    const { previous_total, present_total } = billing.totals;

    const devicePreviousTotal = {
        ...previous_total,
        deviceName: modifiedDeviceName,
    };
    const devicePresentTotal = {
        ...present_total,
        deviceName: modifiedDeviceName,
    };
    /* -------------------------------------------------------------------
    /* Billing Ends ------------------------------------------------------
    --------------------------------------------------------------------*/

    // Place all data for device in new object
    return {
        [modifiedDeviceName]: {
            name: modifiedDeviceName,
            // Dashboard data
            total_kwh,
            min_demand,
            max_demand,
            avg_demand,
            dashboard_carbon_emissions,
            cost_of_energy,
            today,
            yesterday,
            daily_kwh: deviceDailyKwh,
            usage_hours: deviceMonthlyUsage,
            // Score card data
            is_generator,
            baseline_energy,
            peak_to_avg_power_ratio,
            score_card_carbon_emissions,
            generator_size_efficiency: [generator_size_efficiency],
            change_over_lags,
            operating_time,
            fuel_consumption: [fuel_consumption],
            // Power Quality Data
            power_quality: [powerQualityData],
            // Last Reading Data
            last_reading: [lastReadingData],
            // Power Demand Data
            power_demand: [{ dates: power_demand_dates, ...power_demand_values }],
            // Time of Use Data
            time_of_use_chart: [timeOfUseChartData],
            time_of_use_table: [deviceTimeOfUseTableData],
            // Energy Consumption Data
            energy_consumption_values: [
                { dates: energy_consumption_dates, ...energy_consumption_values },
            ],
            energy_consumption_previous: energy_consumption_previous,
            energy_consumption_current: energy_consumption_current,
            energy_consumption_usage: energy_consumption_usage,
            // Cost Tracker Data
            cost_tracker_diesel_qty: [{ modifiedBranchCostTrackerDieselQuantityData }],
            cost_tracker_monthly_cost: [{ modifiedBranchCostTrackerMonthlyCostData }],
            cost_tracker_consumption: [{ modifiedBranchCostTrackerConsumptionData }],
            // Billing Data
            billing_consumption_kwh: [
                {
                    ...consumptionKwhWithoutName,
                    deviceName: modifiedDeviceName,
                },
            ],
            billing_consumption_naira: consumptionNairaWithoutName,
            overall_billing_totals: deviceBillingTotalsData,
            devices_previous_billing_total: [devicePreviousTotal],
            devices_present_billing_total: [devicePresentTotal],
        },
    };
}

export { getDeviceData};
