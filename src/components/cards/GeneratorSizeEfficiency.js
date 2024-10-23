import React, {useEffect, useState,} from "react";
import { numberFormatter } from "../../helpers/numberFormatter";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../../icons/InformationIcon';
import { SCORE_CARD_TOOLTIP_MESSAGES } from "../toolTips/Score_Card_Tooltip_Messages";
import ScoreCardDoughnutChart from "../pieCharts/ScoreCardDoughnutChart";
import { calculatePercentage, daysInMonth, getBaselineEnergyColor } from "../../helpers/genericHelpers";
import ScoreCardGenEfficiencyDoughnut from "../pieCharts/ScoreCardGenEfficiencyDoughnut";



const GeneratorSizeEfficiency = ({ generatorSizeEfficiencyData, uiSettings }) => {
    const [baselineEnergyData, setBaselineEnergyData] = useState({});

    // useEffect(() => {
    //     const baselineData = {baseline_energy: {}}
    //     baselineEnergyBranchData && baselineEnergyBranchData.devices && baselineEnergyBranchData.devices.forEach(data => {
    //       const score_card = data.score_card.baseline_energy;
    //         console.log('Gen-Size-Efficiency  ==> ', score_card);
    //       if (data.is_source) {
    //         setBaselineEnergyData(score_card)
    //         }
    //     });
    // }, [baselineEnergyBranchData]);

    const date = new Date();

    let generatorSizeEffficiencyData, generatorSizeEffficiencyDoughnuts;

    generatorSizeEffficiencyData =
      generatorSizeEfficiencyData && generatorSizeEfficiencyData.filter(Boolean);
    generatorSizeEffficiencyData = generatorSizeEffficiencyData?.filter(
      eachDevice => eachDevice.is_gen === true
    );

    generatorSizeEffficiencyDoughnuts =
      generatorSizeEffficiencyData &&
      generatorSizeEffficiencyData.map((eachGenerator) => (

        <ScoreCardGenEfficiencyDoughnut
          data={eachGenerator}
        //   peakData={peakToAverageKVa}
          key={eachGenerator.name}
          uiSettings={uiSettings}

        />
      ));

    return (
        <article className='score-card-row-4__left'>
            {/* <h2 className='score-card-heading'>Generator Size Efficiency</h2> */}
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
          </article>
    );
}

export default GeneratorSizeEfficiency;
