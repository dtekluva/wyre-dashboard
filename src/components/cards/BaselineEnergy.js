import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardDoughnutChart from "../pieCharts/ScoreCardDoughnutChart";
import { calculatePercentage, daysInMonth, getBaselineEnergyColor } from "../../helpers/genericHelpers";



const BaselineEnergy = ({ baselineEnergyBranchData, uiSettings }) => {
    const [baselineEnergyData, setBaselineEnergyData] = useState({});

    useEffect(() => {
        const baselineData = {baseline_energy: {}}
        baselineEnergyBranchData && baselineEnergyBranchData.devices && baselineEnergyBranchData.devices.forEach(data => {
          const score_card = data.score_card.baseline_energy;
          if (data.is_source) {
            setBaselineEnergyData(score_card)
            }
        });
    }, [baselineEnergyBranchData]);

    const date = new Date();
    const savingdInbound = baselineEnergyData?.forecast - ((baselineEnergyData?.used / date?.getDate()) * daysInMonth());

    return (
        <article className='score-card-row-1__item'>
            <div className='doughnut-card-heading'>
              <h2 className='score-card-heading'>
                Baseline Energy
              </h2>
              <div>
                <Tooltip placement='top' style={{ textAlign: 'justify' }}
                  popupStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.BASE_ENERGY}>
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
            </div>
            <div className='score-card-doughnut-container'>
              <ScoreCardDoughnutChart
                uiSettings={uiSettings}
                data={baselineEnergyData}
              />

              <p className='doughnut-centre-text'>
                <span>
                  {baselineEnergyData &&
                    (calculatePercentage(
                      baselineEnergyData.used,
                      baselineEnergyData.forecast
                    ) || `-`)}{baselineEnergyData.used && '%'}
                </span>
                <span>{baselineEnergyData.used && baselineEnergyData.forecast ? `used` : ' '}</span>
              </p>
            </div>

            <p className='score-card-bottom-text'>
              Baseline Forecast: {baselineEnergyData && numberFormatter(baselineEnergyData.forecast)}
              {baselineEnergyData && baselineEnergyData.unit}
            </p>

            <p className='score-card-bottom-text h-mt-16'>
              So far ({new Date().getDate()} Days): {baselineEnergyData && numberFormatter(baselineEnergyData.used)}
              {baselineEnergyData && baselineEnergyData.unit}
            </p>

            <p className='score-card-bottom-text h-mt-24'>
              Savings Inbound {' '}

              {savingdInbound && <span style={{ color: getBaselineEnergyColor(savingdInbound).color }}>{
                numberFormatter(savingdInbound)
              }
              </span>
              }
              {/* {baseline_energy && baseline_energy.unit} */}

            </p>
          </article>
    );
}

export default BaselineEnergy;
