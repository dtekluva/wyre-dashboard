import React, { useContext } from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';

import CompleteDataContext from '../Context';

import dataHttpServices from '../services/devices';

const { RangePicker } = DatePicker;

function DateTimePicker({ isDateTimePickerDisabled }) {
  const {
    setUserDateRange,
    setSelectedDateRange
  } = useContext(CompleteDataContext);

  function onChange(value, dateString) {
    setUserDateRange(value);
    setSelectedDateRange(dateString);
    dataHttpServices.setEndpointDateRange(value);
  }

  function onOk(value) {
    setUserDateRange(value);
    dataHttpServices.setEndpointDateRange(value);
  }

  return (
    <>
      <Space
        className="date-range-picker-containers"
        direction="vertical"
        size={12}
      >
        <RangePicker
          className="date-range-picker"
          showTime={{
            format: 'HH:mm',
            defaultValue: [moment('00:00:00', 'HH:mm:ss')],
          }}
          format="DD-MM-YYYY HH:mm"
          onChange={onChange}
          onOk={onOk}
          disabled={isDateTimePickerDisabled}
          presets={[
            {
              label: 'Today',
              value: [moment().startOf('day'), moment()],
            },
            {
              label: 'Past 24 Hours',
              value: [moment().subtract(24, 'hours'), moment()],
            },
            {
              label: 'Past Week',
              value: [moment().subtract(7, 'days').startOf('day'), moment()],
            },
            {
              label: 'Past Month',
              value: [moment().subtract(1, 'months').startOf('day'), moment()],
            },
            {
              label: 'Past Three Months',
              value: [moment().subtract(3, 'months').startOf('day'), moment()],
            },
            {
              label: 'Past Half Year',
              value: [moment().subtract(6, 'months').startOf('day'), moment()],
            },
            {
              label: 'Past Year',
              value: [moment().subtract(1, 'years').startOf('day'), moment()],
            },
            {
              label: 'This Week',
              value: [moment().startOf('week'), moment()],
            },
            {
              label: 'This Month',
              value: [moment().startOf('month'), moment()],
            },
            {
              label: 'This Quarter',
              value: [moment().startOf('quarter'), moment()],
            },
            {
              label: 'This Year',
              value: [moment().startOf('year'), moment()],
            },
          ]}
        />

      </Space>
    </>
  );
}

export default DateTimePicker;
