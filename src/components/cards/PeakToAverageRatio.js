import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardDoughnutChart from "../pieCharts/ScoreCardDoughnutChart";
import { calculatePercentage, calculateRatio, daysInMonth, getBaselineEnergyColor, getPeakToAverageMessage } from "../../helpers/genericHelpers";
import UpArrowIcon from "../../icons/UpArrowIcon";

const PeakToAverageRatio = ({ paprBranchData, uiSettings }) => {
    const [paprData, setPaprData] = useState({});

    useEffect(() => {
        const paprPageData = {peak_to_avg_power_ratio: {}}
        paprBranchData && paprBranchData.devices && paprBranchData.devices.forEach(data => {
          const score_card = data.score_card.peak_to_avg_power_ratio;
          if (data.is_source) {
            setPaprData(score_card)
            }
        });
    }, [paprBranchData]);

    let ratio, getPeakResult, arrowColor;

    ratio = paprData ? calculateRatio(paprData.avg, paprData.peak) : 0;
    getPeakResult = getPeakToAverageMessage(ratio);
    arrowColor = paprData.color;

    return (
        <article className='score-card-row-1__item'>
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
              {paprData && <ScoreCardDoughnutChart
                uiSettings={uiSettings}
                data={paprData}
              />}

              <p className='doughnut-centre-text'>
                <span>
                  {paprData && (
                    calculateRatio(
                      paprData.avg,
                      paprData.peak
                    ) || `-`)}{' '}
                </span>
              </p>
            </div>

            <p className='score-card-bottom-text'>
              Average Load:{' '}
              {paprData && numberFormatter(paprData.avg)}
              {paprData && 'kVA'}
            </p>

            <p className='score-card-bottom-text h-mt-16'>
              Peak Load: {paprData && numberFormatter(paprData.peak)}
              {paprData && 'kVA'}
            </p>

            <div className='score-card-bottom-text score-card-message-with-icon h-mt-24 h-flex'>
              <p style={{ color: arrowColor }}>{getPeakResult.message}</p>
              <UpArrowIcon className={arrowColor} />
            </div>
          </article>
    );
}

export default PeakToAverageRatio;