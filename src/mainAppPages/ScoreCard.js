import React, { useEffect, useContext } from 'react';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import ScoreCardDoughnutChart from '../components/pieCharts/ScoreCardDoughnutChart';
import ScoreCardTable from '../components/tables/ScoreCardTable';
import ScoreCardBarChart from '../components/barCharts/ScoreCardBarChart';
import ScoreCardGenEfficiencyDoughnut from '../components/pieCharts/ScoreCardGenEfficiencyDoughnut';
import ScoreCardFuelConsumptionDoughnut from '../components/pieCharts/ScoreCardFuelConsumptionDoughnut';
import Loader from '../components/Loader';


import UpArrowIcon from '../icons/UpArrowIcon';

import { calculateRatio, calculatePercentage } from '../helpers/genericHelpers';
import { numberFormatter } from "../helpers/numberFormatter";

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Score Card', id: 2 },
];

function ScoreCard({ match }) {
  const {
    refinedRenderedData,
    setCurrentUrl,
    isAuthenticatedDataLoading,
  } = useContext(CompleteDataContext);

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
    change_over_lags,
    operating_time,
    fuel_consumption,
  } = refinedRenderedData;


  const generatorSizeEffficiencyData =
    generator_size_efficiency && generator_size_efficiency.filter(Boolean);

  const generatorSizeEffficiencyDoughnuts =
    generatorSizeEffficiencyData &&
    generatorSizeEffficiencyData.map((eachGenerator) => (
      <ScoreCardGenEfficiencyDoughnut
        data={eachGenerator}
        key={eachGenerator.name}
      />
    ));

  const fuelConsumptionData =
    fuel_consumption && fuel_consumption.filter(Boolean);

  const fuelConsumptionDoughnuts =
    fuelConsumptionData &&
    fuelConsumptionData.map((eachGenerator) => (
      <ScoreCardFuelConsumptionDoughnut
        data={eachGenerator}
        key={eachGenerator.name}
      />
    ));
  
   if (isAuthenticatedDataLoading) {
     return <Loader />;
   }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className='score-card-row-1'>
        <article className='score-card-row-1__item baseline-energy-container'>
          <h2 className='score-card-heading'>Baseline Energy</h2>

          <div className='score-card-doughnut-container'>
            <ScoreCardDoughnutChart
              dataTitle='Baseline Energy'
              dataSubtitle='
            Describes the desparity between peak and average(b)
            power demand of a facility. The higher the ratio(b)
            the better, the lower the ratio the worse it becomes.'
              data={baseline_energy}
            />

            <p className='doughnut-centre-text'>
              <span>
                {baseline_energy &&
                  calculatePercentage(
                    baseline_energy.used,
                    baseline_energy.forecast
                  )}
                %
              </span>
              <span> Used</span>
            </p>
          </div>

          <p className='score-card-bottom-text'>
            Baseline Forecast: {baseline_energy && numberFormatter(baseline_energy.forecast)}
            {baseline_energy && baseline_energy.unit}
          </p>

          <p className='score-card-bottom-text h-mt-16'>
            So far (Days): {baseline_energy && numberFormatter(baseline_energy.used)}
            {baseline_energy && baseline_energy.unit}
          </p>

          <p className='score-card-bottom-text h-mt-24'>
            Saving Inbound of{' '}
            <span className='h-green-text'>
              {baseline_energy &&
                numberFormatter(baseline_energy.forecast - baseline_energy.used)}
              {baseline_energy && baseline_energy.unit}
            </span>
          </p>
        </article>

        <article className='score-card-row-1__item'>
          <h2 className='score-card-heading peak-to-average-container'>
            Peak to Average Power Ratio
          </h2>

          <div className='score-card-doughnut-container'>
            <ScoreCardDoughnutChart
              dataTitle='Peak to Average Power Ratio'
              dataSubtitle='
            Describes the desparity between peak and average (b)
            power demand of a facility. The higher the ratio (b) 
            the better, the lower the ratio the worse it becomes.'
              data={peak_to_avg_power_ratio}
            />

            <p className='doughnut-centre-text'>
              <span>
                {peak_to_avg_power_ratio &&
                  calculateRatio(
                    peak_to_avg_power_ratio.peak,
                    peak_to_avg_power_ratio.avg
                  )}{' '}
              </span>
            </p>
          </div>

          <p className='score-card-bottom-text'>
            Average Load:{' '}
            {peak_to_avg_power_ratio && numberFormatter(peak_to_avg_power_ratio.avg)}
            {peak_to_avg_power_ratio && peak_to_avg_power_ratio.unit}
          </p>

          <p className='score-card-bottom-text h-mt-16'>
            Peak Load: {peak_to_avg_power_ratio && numberFormatter(peak_to_avg_power_ratio.peak)}
            {peak_to_avg_power_ratio && peak_to_avg_power_ratio.unit}
          </p>

          <div className='score-card-bottom-text score-card-message-with-icon h-mt-24 h-flex'>
            <p className='h-red-text'>Not so efficient - Higher is better</p>
            <UpArrowIcon />
          </div>
        </article>

        <article className='score-card-row-1__item'>
          <h2 className='score-card-heading carbon-emission-container'>
            Carbon Emission
          </h2>

          <div className='score-card-doughnut-container'>
            <ScoreCardDoughnutChart
              dataTitle='Carbon Emission'
              dataSubtitle='
            Describes the desparity between peak and average (b)
            power demand of a facility. The higher the ratio (b) 
            the better, the lower the ratio the worse it becomes.'
              data={score_card_carbon_emissions}
            />

            <p className='doughnut-centre-text'>
              <span>
                {score_card_carbon_emissions &&
                  calculatePercentage(
                    score_card_carbon_emissions.actual_value,
                    score_card_carbon_emissions.estimated_value
                  )}
                %
              </span>{' '}
              Used
            </p>
          </div>

          <p className='score-card-bottom-text'>
            Estimated:{' '}
            {score_card_carbon_emissions &&
              numberFormatter(score_card_carbon_emissions.estimated_value)}{' '}
            {score_card_carbon_emissions && score_card_carbon_emissions.unit}
          </p>

          <p className='score-card-bottom-text h-mt-16'>
            Actual Emission:{' '}
            {score_card_carbon_emissions &&
              numberFormatter(score_card_carbon_emissions.actual_value)}{' '}
            {score_card_carbon_emissions && score_card_carbon_emissions.unit}
          </p>

          {/* <p className='score-card-bottom-text h-mt-24 h-red-text'>
            <span>Conditional Sub-text Should Go Here</span>{' '}
            <span className='score-card-bottom-text-small'>
              (Additional Conditional Sub-text Should Go Here)
            </span>
          </p> */}
        </article>
      </div>

      <div className='score-card-row-4' style={{marginBottom:'50px'}}>
        <article className='score-card-row-4__left'>
          <h2 className='score-card-heading'>Generator Size Efficiency</h2>
          {generatorSizeEffficiencyDoughnuts}
          <p className='gen-efficiency-footer-text'>
            Utilization factor for facility generators
          </p>
        </article>

        <article className='score-card-row-4__right'>
          <h2 className='score-card-heading'>Fuel Consumption</h2>
          {fuelConsumptionDoughnuts}
          <p className='fuel-consumption-footer-text'>
            Estimated Fuel Consumption for facility gens
          </p>
        </article>
    </div>

      <article className='score-card-row-2'>
        <h2 className='changeover-lags-heading score-card-heading'>
          Change Over Lags
        </h2>
        <ScoreCardTable changeOverLagsData={change_over_lags} />
      </article>

      <article className='score-card-row-3'>
        <ScoreCardBarChart operatingTimeData={operating_time} />
      </article>
    </>
  );
}

export default ScoreCard;
