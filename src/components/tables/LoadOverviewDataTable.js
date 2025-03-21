import React from 'react';

import { CHART_BACKGROUD_COLOR } from '../../helpers/constants';
import { convertDecimalTimeToNormal } from '../../helpers/genericHelpers';



function LoadOverviewDataTable({ device, index, pDemand }) {

  return (
    <>
      <article className={'load-overviews-table-data'}>
        <div className='load-overview-card-data__header'>
          <div style={{ backgroundColor: CHART_BACKGROUD_COLOR[index] || '#6C00FA' }}
            className='load-overview-tag-header-color-box red'>
          </div>
          <p>
            {device.name}
          </p>
        </div>
        <div>
          <hr />
          <p>
            Consumption: {device.consumption}kWh
          </p>
          <hr />
          <p>
            Maximum Demand: {pDemand.min}kW
          </p>
          <hr />
          <p>
            Minimum Demand: {pDemand.max}kW
          </p>
          <hr />
          <p>
            Average Demand: {pDemand.avg}kW
          </p>
          <hr />
          <p>
            Running Time: {convertDecimalTimeToNormal(device.device_runtime) || 0}
          </p>
        </div>
      </article>
    </>

  );
}

export default LoadOverviewDataTable;
