import { numberFormatter } from '../../helpers/numberFormatter';

const ReportWithRate = ({ header, color, icon, value, rate, unit }) => {
  const Component = icon;
  return (
    <>
      <h3 className="report-card-1-heading">{header}</h3>
      <div className='report-card-with-rate__content-wrapper'>
        <div className='report-card-with-rate__icon-wrapper'
          style={{ backgroundColor: color.backgroundColor }}>
          <Component style={{ stroke: color, fill: color.color }} className={'report-card-icon'} />
        </div>
        <p className="report-card-1-percentage">
          {numberFormatter(Number(value).toFixed(2))}<span style={{'fontSize': unit.length> 1 && '2rem'}}>{unit}</span>
        </p>
      </div>

      <div className="report-card-1-rating">
        {/* <Rate
          allowHalf
          value={rate}
        /> */}
      </div>
    </>
  )
}

export default ReportWithRate;
