import ReportWithRate from './ReportWithRate';


const colorSelector = {
  paprScore: { backgroundColor: '#FFECF6', color: '#FF3DA1'}
}

const MiniDoubleCard = ({ paprRatio, metrics, type, icon, header }) => {
  const color = colorSelector[type];
  // const averagePowerValue = 0.8;

  return (
    // <div className="report-row-1-card report-card-2 report-card">
    <div className="report-card-double report-card ">
      {/* <div className="report-card-2__top"> */}
      <div className="report-card-2__top report-card-2__top-margin">
        <div className="report-card-2__topleft">
          <ReportWithRate header={header} icon={icon}
            value={paprRatio} rate={paprRatio}
            unit={''} color={color} />
        </div>
        <div className="report-card-2__topright report-card-2__topleft-double" style={{ width: '50%', marginRight: '5%' }}>
          <div>
            <p className="report-card-2-topright__first">
              <span className="h-block report-card-2-decr">
                Peak Value{' '}
              </span>
              <span className="h-screen-reader-text"> value is </span>
              <span className="report-card-2-topright__value">
                {
                  ((metrics?.max_demand? metrics?.max_demand: 0).toFixed(1) + 'kVA')}
              </span>
            </p>

            <p className="report-card-2-topright__second">
              <span className="h-block report-card-2-decr">
                Avg Value{' '}
              </span>
              <span className="h-screen-reader-text"> value is </span>
              <span className="report-card-2-topright__value">
                {
                  (metrics?.avg_demand? metrics?.avg_demand: 0).toFixed(1) + 'kVA'}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="report-card-2__bottom">
        <p>
        PAPR- Ratio of average load to peak load.
        </p>
      </div>
    </div>
  )
}

export default MiniDoubleCard;
