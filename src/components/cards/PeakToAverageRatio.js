import React, { useEffect, useState, } from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { message, Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardDoughnutChart from "../pieCharts/ScoreCardDoughnutChart";
import { calculatePercentage, calculateRatio, daysInMonth, getBaselineEnergyColor, getPeakToAverageMessage } from "../../helpers/genericHelpers";
import UpArrowIcon from "../../icons/UpArrowIcon";
import { getOrganizationPeakToAveragePowerRatio } from "../../helpers/organizationDataHelpers";

const PeakToAverageRatio = ({ paprBranchData, uiSettings }) => {
  const [paprData, setPaprData] = useState(null);
  const [ptherValues, setOtherValues] = useState(null);


  useEffect(() => {
    if (paprBranchData) {
      const peak_to_avg_power_ratio = getOrganizationPeakToAveragePowerRatio({ branches: [paprBranchData] })
      if (peak_to_avg_power_ratio) {
        const pekToAvgData = {
          unit: 'kVA',
          peak: (peak_to_avg_power_ratio.peak),
          avg: (peak_to_avg_power_ratio.avg),
        }
        setPaprData(pekToAvgData)
        const ratio = pekToAvgData ? calculateRatio(pekToAvgData.avg, pekToAvgData.peak) : 0;
        const getPeakResult = getPeakToAverageMessage(ratio);
        const arrowColor = getPeakResult.color;
        setOtherValues({
          ratio,
          arrowColor,
          message: getPeakResult.message
        })

      }
    }
  }, [paprBranchData]);

  return (
    <article className='score-card-row-1__item'>
      <div className='doughnut-card-heading'>
        <h2 className='score-card-heading'>
          Peak to Average Power Ratio
        </h2>
        <div>
          <Tooltip placement='top' style={{ textAlign: 'justify' }}
            popupStyle={{ whiteSpace: 'pre-line' }} title={SCORE_CARD_TOOLTIP_MESSAGES.PEAK_RATIO}>
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
      {ptherValues && (
        <div className='score-card-bottom-text score-card-message-with-icon h-mt-24 h-flex'>
          <p style={{ color: ptherValues.arrowColor }}>{ptherValues.message}</p>
          <UpArrowIcon className={ptherValues.arrowColor} />
        </div>
      )
      }
    </article>
  );
}

export default PeakToAverageRatio;