import React, { useEffect, useState, } from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardDoughnutChart from "../pieCharts/ScoreCardDoughnutChart";
import { calculatePercentage, daysInMonth, getBaselineEnergyColor } from "../../helpers/genericHelpers";
import ScoreCardGenEfficiencyDoughnut from "../pieCharts/ScoreCardGenEfficiencyDoughnut";
import ScoreCardFuelConsumptionDoughnut from "../pieCharts/ScoreCardFuelConsumptionDoughnut";
import ScoreCardBarChart from "../barCharts/ScoreCardBarChart";



const OperatingTimeDeviation = ({ operaringTimeDeviationData, uiSettings, deviceLength }) => {

  return (
    <article className={deviceLength > 0 ? 'score-card-row-3' : 'hideCard'}>
      <ScoreCardBarChart operatingTimeData={operaringTimeDeviationData}
        uiSettings={uiSettings}
        dataTitle='Operating Time'
        dataMessage={SCORE_CARD_TOOLTIP_MESSAGES.OPERATING_TIME}
      />
    </article>
  );
}

export default OperatingTimeDeviation;