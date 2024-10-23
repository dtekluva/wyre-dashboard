import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardDoughnutChart from "../pieCharts/ScoreCardDoughnutChart";
import { calculatePercentage, calculateRatio, daysInMonth, getBaselineEnergyColor, getPeakToAverageMessage } from "../../helpers/genericHelpers";
import UpArrowIcon from "../../icons/UpArrowIcon";
import EcoFriendlyIcon from "../../icons/EcoFriendlyIcon";
import { getOrganizationScoreCardCarbonEmissions } from "../../helpers/organizationDataHelpers";

const ScorecardCarbonEmmission = ({ scorecardCarbonEmissionBranchData, uiSettings }) => {
    const [scorecardCarbonEmissionData, setScorecardCarbonEmissionData] = useState({});

    useEffect(() => {
        const paprPageData = {peak_to_avg_power_ratio: {}}
        scorecardCarbonEmissionBranchData && scorecardCarbonEmissionBranchData.devices && scorecardCarbonEmissionBranchData.devices.forEach(data => {
          const score_card = data.score_card.score_card_carbon_emissions;
          if (data.is_source) {
            setScorecardCarbonEmissionData(score_card)
            }
        });
    }, [scorecardCarbonEmissionBranchData]);

    useEffect(() => {
      const score_card_carbon_emissions = getOrganizationScoreCardCarbonEmissions({ branches: [scorecardCarbonEmissionBranchData] });
      setScorecardCarbonEmissionData(score_card_carbon_emissions);
    }, [scorecardCarbonEmissionBranchData]);

    let noOfTrees, message, savingdInboundCarbonEmmission;

    const date = new Date();
    savingdInboundCarbonEmmission = numberFormatter((scorecardCarbonEmissionData?.estimated_value - ((scorecardCarbonEmissionData?.actual_value / date?.getDate()) * daysInMonth())));
    noOfTrees = (savingdInboundCarbonEmmission * 6).toFixed(2);
    message = "Equivalent to " + noOfTrees + " Acacia trees";

    return (<article className='score-card-row-1__item'>
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
          data={scorecardCarbonEmissionData}
        />

        <p className='doughnut-centre-text'>
          <span>
            {scorecardCarbonEmissionData &&
              (calculatePercentage(
                scorecardCarbonEmissionData.actual_value,
                scorecardCarbonEmissionData.estimated_value
              ) || `-`)}{scorecardCarbonEmissionData.actual_value && '%'}
          </span>{scorecardCarbonEmissionData.actual_value ? `used` : ' '}
        </p>
      </div>

      <p style={{ padding: 0 }} className='score-card-bottom-text'>
        Estimated:{' '}
        {scorecardCarbonEmissionData &&
          numberFormatter(scorecardCarbonEmissionData.estimated_value)}{' '}
        {scorecardCarbonEmissionData && scorecardCarbonEmissionData.unit}
      </p>

      <p className='score-card-bottom-text h-mt-16' style={{ padding: 0, margin: 0 }}>
        Actual Emission:{' '}
        {scorecardCarbonEmissionData &&
          numberFormatter(scorecardCarbonEmissionData.actual_value)}{' '}
        {scorecardCarbonEmissionData && scorecardCarbonEmissionData.unit}
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

        {/* <span>{message}</span> */}
        {/* <span className='score-card-bottom-text-small'>
        {noOfTrees}
      </span>{' '}
      <span>Acacia trees</span> */}
      </p>
    </article>
    );
}

export default ScorecardCarbonEmmission;