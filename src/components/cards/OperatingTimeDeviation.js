import React from "react";
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
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