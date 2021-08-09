import React, { useContext } from 'react';
import dayjs from 'dayjs';
import CompleteDataContext from '../Context';

// import { useLocation } from 'react-router-dom';

import dataHttpServices from '../services/devices';

const DateRange = () => {
  const { selectedDateRange, userDateRange, organization } = useContext(CompleteDataContext)
  const scoreCardDate = organization.score_cards_date;

      
  const defaultDateRange = dataHttpServices.endpointDateRange;
  const defaultStartDate = defaultDateRange.split(' ');

  const startDate = dayjs(defaultStartDate[0]).format('MMMM');
  let endArr = defaultStartDate[1].split("/");
  const endDateArray = endArr[1];  
  const endDate = dayjs(endDateArray.split("-").reverse()).format('MMMM');

  const dateRangeStyles = {
    color: '#646464',
    width:'200px'
   };

   const rangeStyles = {
     fontSize: '13px',
     width: 'auto'
   };


   const convertStartDate = (dateRangeStart) => {
     if (dateRangeStart && dateRangeStart.length > 0 ){
      return dayjs(dateRangeStart[0].split('-').reverse()).format('MMMM-YYYY');      
     }
   }
   const convertEndDate = (dateRangeEnd) => {
    if (dateRangeEnd && dateRangeEnd.length > 0 ){
      return dayjs(dateRangeEnd[0].split('-').reverse()).format('MMMM-YYYY');
    }
   
   }

  return (
    <div style={dateRangeStyles}>
      {
      // Displaylocation === '/dashboard' &&
        (userDateRange === null || userDateRange.length ===0 ? (

            <div style={rangeStyles}>
              <span>{scoreCardDate}</span>
            </div>
                
        ) : (
          <div style={rangeStyles}>
            <span>(</span>
            <span>{              
              convertStartDate(selectedDateRange[0].split(' '))            
            }</span>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}> — </span>
            <span>{
              convertEndDate(selectedDateRange[1].split(' '))
              }</span>
            <span>)</span>
          </div>
         ))} 
    </div>
  );
}

export default DateRange
