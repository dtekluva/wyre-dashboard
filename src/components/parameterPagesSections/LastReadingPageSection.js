import React from 'react';

import PhaseBasicMeasurementsTable from '../tables/lastReadingsTables/PhaseBasicMeasurementsTable';
import TotalTable from '../tables/lastReadingsTables/TotalTable';
import HarmonicDistortionTable from '../tables/lastReadingsTables/HarmonicDistortionTable';
import EnergyTable from '../tables/lastReadingsTables/EnergyTable';
import DemandsTable from '../tables/lastReadingsTables/DemandsTable';
import TotalDemandTable from '../tables/lastReadingsTables/TotalDemandTable';

import ExcelIcon from '../../icons/ExcelIcon';

function LastReadingPageSections({ lrData }) {
  const formattedDate =
    lrData && lrData.date.format('dddd, MMMM D, YYYY hh:mm:ss');

  const phaseMeasuresData = lrData && lrData.data.phase_measures;
  const totalData = lrData && lrData.data.totals;
  const energyData = lrData && lrData.data.energy;
  const demandData = lrData && lrData.data.demands;
  const totalDemandData = lrData && lrData.data.total_demands;
  const harmonicDistortionData = lrData && lrData.data.harmonic_distortion;

  return (
    <section className='parameter-section'>
      <h2 className='parameter-section__heading'>
        {lrData && lrData.deviceName}
      </h2>

      <article className='last-reading-table-container'>
        <div className='last-reading-table-header-and-date'>
          <div className='table-header'>
            <div className='h-hidden-medium-down'>
              <button className='table-header__left-button'>PDF</button>
              <button className='table-header__left-button'>CSV</button>
            </div>

            <h2 className='table-header__heading'>Last Reading Raw Logs</h2>

            <button className='table-header__right-button h-hidden-medium-down'>
              <ExcelIcon />
              <span>Download in Excel</span>
            </button>
          </div>

          <p className='last-reading-date'>
            Reading Captured at: {formattedDate}. GMT +0100 (West African
            Standard Time).
          </p>
        </div>

        <div className='last-reading-table-total-and-history first'>
          <h3 className='last-reading-table-total'>Phase Basic Measurements</h3>
          <button className='last-reading-table-history-button'>History</button>
        </div>

        <div className='last-reading-table-wrapper'>
          <PhaseBasicMeasurementsTable data={phaseMeasuresData} />
        </div>
      </article>

      <article className='last-reading-table-container'>
        <div className='last-reading-table-total-and-history'>
          <h3 className='last-reading-table-total'>Total</h3>
          <button className='last-reading-table-history-button'>History</button>
        </div>

        <div className='last-reading-table-wrapper'>
          <TotalTable data={totalData} />
        </div>
      </article>

      <article className='last-reading-table-container'>
        <div className='last-reading-table-total-and-history'>
          <h3 className='last-reading-table-total'>Harmonic Distortion</h3>
          <button className='last-reading-table-history-button'>History</button>
        </div>

        <div className='last-reading-table-wrapper'>
          <HarmonicDistortionTable data={harmonicDistortionData} />
        </div>
      </article>

      <article className='last-reading-table-container'>
        <div className='last-reading-table-total-and-history'>
          <h3 className='last-reading-table-total'>Energy</h3>
          <button className='last-reading-table-history-button'>History</button>
        </div>

        <div className='last-reading-table-wrapper'>
          <EnergyTable data={energyData} />
        </div>
      </article>

      <article className='last-reading-table-container'>
        <div className='last-reading-table-total-and-history'>
          <h3 className='last-reading-table-total'>Demands</h3>
          <button className='last-reading-table-history-button'>History</button>
        </div>

        <div className='last-reading-table-wrapper'>
          <DemandsTable data={demandData} />
        </div>
      </article>

      <article className='last-reading-table-container'>
        <div className='last-reading-table-total-and-history'>
          <h3 className='last-reading-table-total'>Total Demand</h3>
          <button className='last-reading-table-history-button'>History</button>
        </div>

        <div className='last-reading-table-wrapper'>
          <TotalDemandTable data={totalDemandData} />
        </div>
      </article>
    </section>
  );
}

export default LastReadingPageSections;
