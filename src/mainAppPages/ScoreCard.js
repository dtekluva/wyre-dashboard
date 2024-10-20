import React, { useEffect, useContext, useState } from 'react';
import { Tooltip } from 'antd';
import CompleteDataContext from '../Context';

import { fetchPowerFactor } from "../redux/actions/powerFactor/powerFactor.action";

import BreadCrumb from '../components/BreadCrumb';
import ScoreCardDoughnutChart from '../components/pieCharts/ScoreCardDoughnutChart';
import ScoreCardTable from '../components/tables/ScoreCardTable';
import ScoreCardBarChart from '../components/barCharts/ScoreCardBarChart';
import ScoreCardGenEfficiencyDoughnut from '../components/pieCharts/ScoreCardGenEfficiencyDoughnut';
import ScoreCardFuelConsumptionDoughnut from '../components/pieCharts/ScoreCardFuelConsumptionDoughnut';
import Loader from '../components/Loader';

import UpArrowIcon from '../icons/UpArrowIcon';
import EcoFriendlyIcon from '../icons/EcoFriendlyIcon';
import InformationIcon from '../icons/InformationIcon';

import {
  calculateRatio, calculatePercentage, daysInMonth,
  getPeakToAverageMessage, getBaselineEnergyColor,
  sumOperatingTimeValues,
  combineArrayData
} from '../helpers/genericHelpers';

import { numberFormatter } from "../helpers/numberFormatter";

import { SCORE_CARD_TOOLTIP_MESSAGES } from '../components/toolTips/Score_Card_Tooltip_Messages';
import { connect, useSelector } from 'react-redux';
import {  getInitialAllDeviceRefinedOrganizationData, getRefinedOrganizationDataWithChekBox, getScoreCardRefinedData } from '../helpers/organizationDataHelpers';
import { getRenderedData } from '../helpers/renderedDataHelpers';
import { fetchBaselineEnergyData, fetchGeneratorFuelEfficiencyData, fetchGeneratorSizeEfficiencyData, fetchPAPRData, fetchScorecardCarbonEmissionData, fetchScoreCardData, fetchScorecardOperatingTimeData } from '../redux/actions/scorecard/scorecard.action';
import { isEmpty } from '../helpers/authHelper';
import { devicesArray } from '../helpers/v2/organizationDataHelpers';
import BaselineEnergy from '../components/cards/BaselineEnergy';
import PeakToAverageRatio from '../components/cards/PeakToAverageRatio';
import GeneratorSizeEfficiency from '../components/cards/GeneratorSizeEfficiency';
import GeneratorFuelEfficiency from '../components/cards/GeneratorFuelEfficiency';
import OperatingTimeDeviation from '../components/cards/OperatingTimeDeviation';
import ScorecardCarbonEmmission from '../components/cards/ScorecardCarbonEmmission';
// import CarbonEmmission from '../components/cards/CarbonEmmission';
// import { SCORE_CARD_TOOLTIP_MESSAGES } from '../helpers/constants';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Score Card', id: 2 },
];


function ScoreCard({ match, fetchScoreCardData: fetchScoreCard, fetchBaselineEnergyData, fetchPAPRData, fetchScorecardCarbonEmissionData, fetchGeneratorSizeEfficiencyData, fetchScorecardOperatingTimeData, fetchGeneratorFuelEfficiencyData, scorecard }) {

  const [peakToAverageKVa, setPeakToAverageKVA] = useState(null);
  const [refinedScoreCardData, setRefinedScorCardData] = useState({});
  const [allDeviceInfo, setAllDeviceInfo] = useState(false);
  const scoreCardInfo = useSelector((state) => state.scorecard);
  const [baselineEnergyBranchData, setBaselineEnergyBranchData] = useState(null);
  const [paprBranchData, setPaprBranchData] = useState(null);
  const [scorecardCarbonEmissionBranchData, setScorecardCarbonEmissionBranchData] = useState(null);
  const [generatorEfficiencyBranchData, setGeneratorEfficiencyBranchData] = useState(null);
  const [generatorSizeEfficiencyData, setGeneratorSizeEfficiencyData] = useState({});
  const [generatorFuelEfficiencyBranchData, setGeneratorFuelEfficiencyBranchData] = useState(null);
  const [generatorFuelEfficiencyData, setGeneratorFuelEfficiencyData] = useState({});
  const [operaringTimeDeviationBranchData, setOperaringTimeDeviationBranchData] = useState(null);
  const [operaringTimeDeviationData, setOperaringTimeDeviationData] = useState({});
  const [testingoperaringData, setTestingOperaringData] = useState({});
  const sideDetails = useSelector((state) => state.sideBar);
  const [pageLoaded, setPageLoaded] = useState(false);
  const {
    refinedRenderedData,
    setCurrentUrl,
    isAuthenticatedDataLoading,
    uiSettings,
    checkedBranches,
    checkedDevices,
    checkedBranchId,
    checkedDevicesId,
    userDateRange,
  } = useContext(CompleteDataContext);

  useEffect(() => {

    if (scoreCardInfo.scoreCardData) {
      const copyData = JSON.parse(JSON.stringify(scoreCardInfo.scoreCardData));      

      if (Object.keys(checkedBranches).length > 0 || Object.keys(checkedDevices).length > 0) {
 
        const { branchAndDevice, allDeviceData } = getRefinedOrganizationDataWithChekBox({
          checkedBranches,
          checkedDevices,
          organization: copyData,
          setRenderedDataObjects: null,
          isDashBoard: false,
          powerFactorData: null
        });        
        
        const renderedData = getRenderedData(Object.values(branchAndDevice), true, true);
        setRefinedScorCardData(renderedData);
        setAllDeviceInfo(allDeviceData);
      } else {
        setRefinedScorCardData(getScoreCardRefinedData(copyData, null));
        setAllDeviceInfo(getInitialAllDeviceRefinedOrganizationData({ organization: copyData }));
      }
    }
  }, [checkedBranches, checkedDevices, scoreCardInfo.scoreCardData]);

  useEffect(() => {
    const handleGenSizeEficiency = generatorEfficiencyBranchData && generatorEfficiencyBranchData.devices.map(data => data.score_card.generator_size_efficiency);
    setGeneratorSizeEfficiencyData(handleGenSizeEficiency)

  }, [generatorEfficiencyBranchData])

  useEffect(() => {
    const handleGenFuelEficiency = generatorFuelEfficiencyBranchData && generatorFuelEfficiencyBranchData.devices.map(data => data.score_card.fuel_consumption);
    setGeneratorFuelEfficiencyData(handleGenFuelEficiency)

  }, [generatorFuelEfficiencyBranchData])

  useEffect(() => {
    operaringTimeDeviationBranchData && operaringTimeDeviationBranchData.devices && operaringTimeDeviationBranchData.devices.map(data => {
      const handleOperatimgTimeDeviation =  data.score_card.operating_time
      if (data.score_card.is_generator) {
        
        // console.log('OPERATING-TIME ==> ', handleOperatimgTimeDeviation);
        setOperaringTimeDeviationData(handleOperatimgTimeDeviation)
      }
    });

  }, [operaringTimeDeviationBranchData])

  // Just testing this out, just so i can use it to handle summing-up the Operating-Time-Deviation data
  // useEffect(() => {

  //   const getOrganizationOperatingTime = () => {

  //     const allOrganizationDevices = operaringTimeDeviationBranchData;
    
  //     const organizationOperatingTimeDates = allOrganizationDevices.devices.filter(
  //       (eachDevice) => eachDevice.score_card?.is_generator
  //     ).map((eachFilteredDevice) => eachFilteredDevice.score_card.operating_time.chart.dates);
      
  //     const allDevicesOperatingTimeValues = allOrganizationDevices.filter(
  //       (eachDevice) => eachDevice.score_card?.is_generator
  //     ).map((eachFilteredDevice) => eachFilteredDevice.score_card.operating_time.chart.values );
    
  //     const allDevicesOperatingTimeWastedEnergy = allOrganizationDevices.filter(
  //       (eachDevice) => eachDevice.score_card?.is_generator
  //     ).map((eachFilteredDevice) => eachFilteredDevice.score_card.operating_time.chart.energy_wasted );
    
  //     const organizationOperatingTimeValues = combineArrayData(
  //       allDevicesOperatingTimeValues
  //     );
    
  //     const sumOrganizationOperatingTimeDates = combineArrayData(
  //       organizationOperatingTimeDates
  //     );
      
  //     const organizationOperatingTimeWastedEnergy = combineArrayData(
  //       allDevicesOperatingTimeWastedEnergy
  //     );
    
  //     const organizationEstimatedTimeWasted = sumOperatingTimeValues(
  //       allOrganizationDevices,
  //       'estimated_time_wasted'
  //     );
  //     const organizationEstimatedEnergyWasted = sumOperatingTimeValues(
  //       allOrganizationDevices,
  //       'estimated_energy_wasted'
  //     );
  //     const organizationEstimatedDieselWasted = sumOperatingTimeValues(
  //       allOrganizationDevices,
  //       'estimated_diesel_wasted'
  //     );
  //     const organizationEstimatedDieselCost = sumOperatingTimeValues(
  //       allOrganizationDevices,
  //       'estimated_cost'
  //     );
    
  //     return {
  //       chart: {
  //         dates: sumOrganizationOperatingTimeDates,
  //         values: organizationOperatingTimeValues,
  //         energy_wasted: organizationOperatingTimeWastedEnergy
  //       },
  //       estimated_time_wasted: {
  //         unit: 'hours',
  //         value: organizationEstimatedTimeWasted,
  //       },
  //       estimated_energy_wasted: {
  //         unit: 'kWh',
  //         total: organizationEstimatedEnergyWasted,
  //       },
  //       estimated_diesel_wasted: {
  //         unit: 'litres',
  //         value: organizationEstimatedDieselWasted,
  //       },
  //       estimated_cost: {
  //         unit: 'naira',
  //         value: organizationEstimatedDieselCost,
  //       },
  //     };
  //   };
  //   setTestingOperaringData(getOrganizationOperatingTime)

  // }, [operaringTimeDeviationBranchData])

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);


  useEffect(() => {
    if (!pageLoaded && isEmpty(scoreCardInfo.scoreCardData || {})) {
      fetchScoreCard(userDateRange);
    }

    if (!isEmpty(scoreCardInfo.scoreCardData) > 0 && pageLoaded) {
      fetchScoreCard(userDateRange);
    }
    setPageLoaded(true);
  }, [userDateRange]);

  useEffect(() => {
    if (!pageLoaded && isEmpty(scoreCardInfo.scoreCardData || {})) {
      fetchBaselineEnergyData(userDateRange);
      fetchPAPRData(userDateRange);
      fetchScorecardCarbonEmissionData(userDateRange);
      fetchGeneratorSizeEfficiencyData(userDateRange);
      fetchGeneratorFuelEfficiencyData(userDateRange);
      fetchScorecardOperatingTimeData(userDateRange);
    }

    if (!isEmpty(scoreCardInfo.scoreCardData) > 0 && pageLoaded) {
      fetchBaselineEnergyData(userDateRange);
      fetchPAPRData(userDateRange);
      fetchScorecardCarbonEmissionData(userDateRange);
      fetchGeneratorSizeEfficiencyData(userDateRange);
      fetchGeneratorFuelEfficiencyData(userDateRange);
      fetchScorecardOperatingTimeData(userDateRange);
    }
    setPageLoaded(true);
  }, [userDateRange]);

  useEffect(() => {
    if (pageLoaded && scorecard.baselineEnergyData) {
      const devicesArrayData = devicesArray(scorecard.baselineEnergyData.branches, checkedBranchId, checkedDevicesId);
      setBaselineEnergyBranchData(devicesArrayData)
    }
    setPageLoaded(true);
  }, [scorecard.baselineEnergyData, checkedBranchId, checkedDevicesId.length]);
  
  useEffect(() => {
    if (pageLoaded && scorecard.paprData) {
      const devicesArrayData = devicesArray(scorecard.paprData.branches, checkedBranchId, checkedDevicesId);
      setPaprBranchData(devicesArrayData)
    }
    setPageLoaded(true);
  }, [scorecard.paprData, checkedBranchId, checkedDevicesId.length]);
  
  useEffect(() => {
    if (pageLoaded && scorecard.scorecardCarbonEmissionData) {
      const devicesArrayData = devicesArray(scorecard.scorecardCarbonEmissionData.branches, checkedBranchId, checkedDevicesId);
      setScorecardCarbonEmissionBranchData(devicesArrayData)
    }
    setPageLoaded(true);
  }, [scorecard.scorecardCarbonEmissionData, checkedBranchId, checkedDevicesId.length]);

  useEffect(() => {
    if (pageLoaded && scorecard.generatorSizeEfficiencyData) {
      const devicesArrayData = devicesArray(scorecard.generatorSizeEfficiencyData.branches, checkedBranchId, checkedDevicesId);
      setGeneratorEfficiencyBranchData(devicesArrayData)
    }
    setPageLoaded(true);
  }, [scorecard.generatorSizeEfficiencyData, checkedBranchId, checkedDevicesId.length]);
  
  useEffect(() => {
    if (pageLoaded && scorecard.generatorFuelEfficiencyData) {
      const devicesArrayData = devicesArray(scorecard.generatorFuelEfficiencyData.branches, checkedBranchId, checkedDevicesId);
      setGeneratorFuelEfficiencyBranchData(devicesArrayData)
    }
    setPageLoaded(true);
  }, [scorecard.generatorFuelEfficiencyData, checkedBranchId, checkedDevicesId.length]);
  
  useEffect(() => {
    if (pageLoaded && scorecard.operatingTimeDeviationData) {
      const devicesArrayData = devicesArray(scorecard.operatingTimeDeviationData.branches, checkedBranchId, checkedDevicesId);
      setOperaringTimeDeviationBranchData(devicesArrayData)
    }
    setPageLoaded(true);
  }, [scorecard.operatingTimeDeviationData, checkedBranchId, checkedDevicesId.length]);

  useEffect(() => {
    if (Object.keys(sideDetails.sideBarData).length > 0) {

      let allDevices = [];
      sideDetails.sideBarData.branches.forEach((branch) => {
        branch.devices.forEach((device) => {
          allDevices.push(device.device_id)
        })
      })
      // const start_date = moment().startOf('month').format('YYYY-MM-DD');
      // const end_date = moment().startOf('month').format('YYYY-MM-DD');
      // fetchAllPowerFactor(allDevices, { start_date, end_date })

    }


  }, [sideDetails.sideBarData, userDateRange]);





  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const {
    baseline_energy,
    peak_to_avg_power_ratio,
    score_card_carbon_emissions,
    generator_size_efficiency,
    operating_time,
    fuel_consumption,
  } = refinedScoreCardData;
  // console.log('operating_time ==> ', operating_time);
  useEffect(() => {
    if (peak_to_avg_power_ratio) {
      const pekToAvgData = {
        unit: 'kVA',
        peak: (peak_to_avg_power_ratio.peak),
        avg: (peak_to_avg_power_ratio.avg),
      }
      setPeakToAverageKVA(pekToAvgData)
    }
  }, [peak_to_avg_power_ratio]);

  useEffect(() => {
    const baselineData = {baseline_energy: {}}
    generatorEfficiencyBranchData && generatorEfficiencyBranchData.devices.map(data => {
      const score_card = data.score_card.generator_size_efficiency;
      if (data.is_source) {
        // setGeneratorSizeEfficiencyData(score_card)
        }
    });
  }, [generatorEfficiencyBranchData]);

  let date, ratio, savingdInbound, savingdInboundCarbonEmmission, arrowColor, getPeakResult;
  let noOfTrees, message, generatorSizeEffficiencyData, generatorSizeEffficiencyDoughnuts, fuelConsumptionData;

  let deviceLength, fuelConsumptionDoughnuts;

  const dataPresent = Object.keys(refinedRenderedData).length !== 0;
  if (Object.keys(refinedRenderedData).length !== 0) {
    date = new Date();
    ratio = peakToAverageKVa ? calculateRatio(peakToAverageKVa.avg, peakToAverageKVa.peak) : 0;
    savingdInbound = baseline_energy?.forecast - ((baseline_energy?.used / date?.getDate()) * daysInMonth());
    savingdInboundCarbonEmmission = numberFormatter((score_card_carbon_emissions?.estimated_value - ((score_card_carbon_emissions?.actual_value / date?.getDate()) * daysInMonth())));

    getPeakResult = getPeakToAverageMessage(ratio);
    arrowColor = getPeakResult.color;

    //calculate number of trees for carbon emission
    noOfTrees = (savingdInboundCarbonEmmission * 6).toFixed(2);
    message = "Equivalent to " + noOfTrees + " Acacia trees";


    generatorSizeEffficiencyData =
      generator_size_efficiency && generator_size_efficiency.filter(Boolean);
    generatorSizeEffficiencyData = generatorSizeEffficiencyData?.filter(
      eachDevice => eachDevice.is_gen === true
    );

    generatorSizeEffficiencyDoughnuts =
      generatorSizeEffficiencyData &&
      generatorSizeEffficiencyData.map((eachGenerator) => (

        <ScoreCardGenEfficiencyDoughnut
          data={eachGenerator}
          peakData={peakToAverageKVa}
          key={eachGenerator.name}
          uiSettings={uiSettings}

        />
      ));

    fuelConsumptionData =
      fuel_consumption && fuel_consumption.filter(Boolean);

    fuelConsumptionData = fuelConsumptionData?.filter(
      eachDevice => eachDevice.is_gen === true
    );

    deviceLength = fuelConsumptionData?.length;

    fuelConsumptionDoughnuts =
      fuelConsumptionData &&
      fuelConsumptionData.map((eachGenerator) => (
        <ScoreCardFuelConsumptionDoughnut
          data={eachGenerator}
          key={eachGenerator.name}
          uiSettings={uiSettings}
        />
      ));

  }


  if (scoreCardInfo.fetchScoreCardLoading || !pageLoaded) {
    return <Loader />;
  }


  return (
    <> {
      dataPresent && (<>
        <div className='breadcrumb-and-print-buttons'>
          <BreadCrumb routesArray={breadCrumbRoutes} />
        </div>

        <div className='score-card-row-1'>
          {/* <article className='score-card-row-1__item'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>
                Baseline Energy
              </h2>
              <div>
                <Tooltip placement='top' style={{ textAlign: 'justify' }}
                  overlayStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.BASE_ENERGY}>
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
            </div>
            <div className='score-card-doughnut-container'>
              <ScoreCardDoughnutChart
                uiSettings={uiSettings}
                data={baseline_energy}
              />

              <p className='doughnut-centre-text'>
                <span>
                  {baseline_energy &&
                    (calculatePercentage(
                      baseline_energy.used,
                      baseline_energy.forecast
                    ) || `-`)}{baseline_energy.used && '%'}
                </span>
                <span>{baseline_energy.used && baseline_energy.forecast ? `used` : ' '}</span>
              </p>
            </div>

            <p className='score-card-bottom-text'>
              Baseline Forecast: {baseline_energy && numberFormatter(baseline_energy.forecast)}
              {baseline_energy && baseline_energy.unit}
            </p>

            <p className='score-card-bottom-text h-mt-16'>
              So far ({new Date().getDate()} Days): {baseline_energy && numberFormatter(baseline_energy.used)}
              {baseline_energy && baseline_energy.unit}
            </p>

            <p className='score-card-bottom-text h-mt-24'>
              Savings Inbound {' '}

              {savingdInbound && <span style={{ color: getBaselineEnergyColor(savingdInbound).color }}>{
                numberFormatter(savingdInbound)
              }
              </span>
              }

            </p>
          </article> */}
          <BaselineEnergy  baselineEnergyBranchData={baselineEnergyBranchData} uiSettings={uiSettings} />
          
          {/* <article className='score-card-row-1__item'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>
                Peak to Average Power Ratio 
              </h2>
              <div>
                <Tooltip placement='top' style={{ textAlign: 'justify' }}
                  overlayStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.PEAK_RATIO}>
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
            </div>
            <div className='score-card-doughnut-container'>
              {peakToAverageKVa && <ScoreCardDoughnutChart
                uiSettings={uiSettings}
                data={peakToAverageKVa}
              />}

              <p className='doughnut-centre-text'>
                <span>
                  {peakToAverageKVa && (
                    calculateRatio(
                      peakToAverageKVa.avg,
                      peakToAverageKVa.peak
                    ) || `-`)}{' '}
                </span>
              </p>
            </div>

            <p className='score-card-bottom-text'>
              Average Load:{' '}
              {peakToAverageKVa && numberFormatter(peakToAverageKVa.avg)}
              {peakToAverageKVa && 'kVA'}
            </p>

            <p className='score-card-bottom-text h-mt-16'>
              Peak Load: {peakToAverageKVa && numberFormatter(peakToAverageKVa.peak)}
              {peakToAverageKVa && 'kVA'}
            </p>

            <div className='score-card-bottom-text score-card-message-with-icon h-mt-24 h-flex'>
              <p style={{ color: arrowColor }}>{getPeakResult.message}</p>
              <UpArrowIcon className={arrowColor} />
            </div>
          </article> */}
          <PeakToAverageRatio  paprBranchData={paprBranchData} uiSettings={uiSettings} />


          {/* <article className='score-card-row-1__item'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>
                Carbon Emission
              </h2>
              <div>
                <Tooltip placement='top' style={{ textAlign: 'justify' }}
                  overlayStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.CARBON}>
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
            </div>

            <div className='score-card-doughnut-container'>
              <ScoreCardDoughnutChart
                uiSettings={uiSettings}
                data={score_card_carbon_emissions}
              />

              <p className='doughnut-centre-text'>
                <span>
                  {score_card_carbon_emissions &&
                    (calculatePercentage(
                      score_card_carbon_emissions.actual_value,
                      score_card_carbon_emissions.estimated_value
                    ) || `-`)}{score_card_carbon_emissions.actual_value && '%'}
                </span>{score_card_carbon_emissions.actual_value ? `used` : ' '}
              </p>
            </div>

            <p style={{ padding: 0 }} className='score-card-bottom-text'>
              Estimated:{' '}
              {score_card_carbon_emissions &&
                numberFormatter(score_card_carbon_emissions.estimated_value)}{' '}
              {score_card_carbon_emissions && score_card_carbon_emissions.unit}
            </p>

            <p className='score-card-bottom-text h-mt-16' style={{ padding: 0, margin: 0 }}>
              Actual Emission:{' '}
              {score_card_carbon_emissions &&
                numberFormatter(score_card_carbon_emissions.actual_value)}{' '}
              {score_card_carbon_emissions && score_card_carbon_emissions.unit}
            </p>

            <p className='score-card-bottom-text h-mt-16' style={{ padding: 0, margin: 0 }}>
              Savings Inbound {' '}
              {savingdInboundCarbonEmmission && <span style={{
                color: getBaselineEnergyColor(savingdInboundCarbonEmmission).color
              }}>{
                  savingdInboundCarbonEmmission
                }
              </span>
              }
            </p>

            <p className='score-card-bottom-text h-mt-24' style={{ padding: 0, margin: 0 }} >
              <span>{message}</span>
              <EcoFriendlyIcon className="ecoFriendlyIcon" />
            </p>
          </article> */}
          <ScorecardCarbonEmmission scorecardCarbonEmissionBranchData={scorecardCarbonEmissionBranchData} uiSettings={uiSettings} />
        </div>
        {/*{isGenStatus > 0 ? 'score-card-row-2' : 'hideCard'}*/}
        <div className={deviceLength > 0 ? 'score-card-row-4' : 'hideCard'} style={{ marginBottom: '50px' }}>
          {/* <article className='score-card-row-4__left'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>Generator Size Efficiency</h2>
              <Tooltip placement='top' style={{ textAlign: 'justify' }}
                overlayStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.SIZE_EFFICIENCY}>
                <p>
                  <InformationIcon className="info-icon" />
                </p>
              </Tooltip>
            </div>
            {generatorSizeEffficiencyDoughnuts}
            <p className='gen-efficiency-footer-text'>
              Utilization Factor for Facility Generators
            </p>
          </article> */}
          <GeneratorSizeEfficiency generatorSizeEfficiencyData={generatorSizeEfficiencyData} uiSettings={uiSettings} />

          {/* <article className='score-card-row-4__right'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>Fuel Efficiency</h2>
              <Tooltip placement='top' style={{ textAlign: 'justify' }}
                overlayStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.FUEL_EFFICIENCYL}>
                <p>
                  <InformationIcon className="info-icon" />
                </p>
              </Tooltip>
            </div>
            {fuelConsumptionDoughnuts}
            <p className='fuel-consumption-footer-text'>
              Estimated Fuel Consumption for Facility Generators
            </p>
          </article> */}
          <GeneratorFuelEfficiency generatorFuelEfficiencyData={generatorFuelEfficiencyData} uiSettings={uiSettings} />
        </div>

        {/* <article className={deviceLength > 0 ? 'score-card-row-2' : 'hideCard'}>
          <h2 className='changeover-lags-heading score-card-heading'>
            Change Over Lags
          </h2>
          <ScoreCardTable changeOverLagsData={change_over_lags} />
        </article> */}


        {/* <article className= {deviceLength > 0 ? 'score-card-row-3' : 'hideCard'}>
          <ScoreCardBarChart operatingTimeData={operating_time}
            uiSettings={uiSettings}
            dataTitle='Operating Time'
            dataMessage={SCORE_CARD_TOOLTIP_MESSAGES.OPERATING_TIME}
          />
        </article> */}
        <OperatingTimeDeviation operaringTimeDeviationData={operaringTimeDeviationData} uiSettings={uiSettings} />
      </>)
    }
    </>

  );
}

const mapDispatchToProps = {
  fetchPowerFactor,
  fetchScoreCardData,
  fetchBaselineEnergyData,
  fetchPAPRData,
  fetchScorecardCarbonEmissionData,
  fetchGeneratorSizeEfficiencyData,
  fetchGeneratorFuelEfficiencyData,
  fetchScorecardOperatingTimeData
};


const mapStateToProps = (state) => ({
  powerFactor: state.powerFactor,
  scorecard: state.scorecard
});

export default connect(mapStateToProps, mapDispatchToProps)(ScoreCard);