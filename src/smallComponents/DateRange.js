import React, { useContext } from 'react'
// import { useLocation } from 'react-router-dom';

import CompleteDataContext from '../Context';
import dataHttpServices from '../services/devices';

const DateRange = () => {
  const { selectedDateRange, userDateRange } = useContext(CompleteDataContext)
  // const Displaylocation = useLocation().pathname;

  const defaultDateRange = dataHttpServices.endpointDateRange;
  const defaultStartDate = defaultDateRange.split(' ');
  const reversedDate = defaultStartDate[1].split('').reverse().join('');
  const defaultEndDate = reversedDate.toString().split('', 10).reverse().join('');


   const dateRangeStyles = {
    color: '#646464'
   };

   const rangeStyles = {
     fontSize: '13px'
   }

  return (
    <div style={dateRangeStyles}>
      {
      // Displaylocation === '/dashboard' &&
        (userDateRange === null || userDateRange.length ===0  ? (
          <div style={rangeStyles}>
            <span>(</span>
            <span>{defaultStartDate[0]}</span>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}> — </span>
            <span>{defaultEndDate}</span>
            <span>)</span>
          </div>
        ) : (
          <div style={rangeStyles}>
            <span>(</span>
            <span>{selectedDateRange[0]}</span>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}> — </span>
            <span>{selectedDateRange[1]}</span>
            <span>)</span>
          </div>
         ))} 
    </div>
  );
}

export default DateRange
