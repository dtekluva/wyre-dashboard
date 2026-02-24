import React from "react";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardFuelConsumptionDoughnut from "../pieCharts/ScoreCardFuelConsumptionDoughnut";

const GeneratorFuelEfficiency = ({ generatorFuelEfficiencyData, uiSettings }) => {
    let fuelConsumptionDoughnuts, fuelConsumptionData;

    fuelConsumptionData =
      generatorFuelEfficiencyData && generatorFuelEfficiencyData.filter(Boolean);

    fuelConsumptionData = fuelConsumptionData?.filter(
      eachDevice => eachDevice.is_gen === true
    );

    fuelConsumptionDoughnuts =
      fuelConsumptionData &&
      fuelConsumptionData.map((eachGenerator) => (
        <ScoreCardFuelConsumptionDoughnut
          data={eachGenerator}
          key={eachGenerator.name}
          uiSettings={uiSettings}
        />
      ));

    return (
        <article className='score-card-row-4__right'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>Fuel Efficiency</h2>
              <Tooltip placement='top' style={{ textAlign: 'justify' }}
                popupStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.FUEL_EFFICIENCYL}>
                <p>
                  <InformationIcon className="info-icon" />
                </p>
              </Tooltip>
            </div>
            {fuelConsumptionDoughnuts}
            <p className='fuel-consumption-footer-text'>
              Estimated Fuel Consumption for Facility Generators
            </p>
          </article>
    );
}

export default GeneratorFuelEfficiency;