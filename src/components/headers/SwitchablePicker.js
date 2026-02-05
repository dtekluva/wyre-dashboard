import { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import { changeSearchDate } from '../../redux/actions/report/actionCreators';

const PickerWithType = ({ type, onChange, defaultData }) =>{
  return <DatePicker style={{height: 40}} defaultValue={defaultData} picker={type} onChange={onChange} />;
}


const SwitchablePicker = ()=> {
  const [type] = useState('month');
  const dispatch = useDispatch();


  let search = window.location.search;
  let params = new URLSearchParams(search);
  let reportDate = params.get('reportDate') || '';
  const defaultDataValue = reportDate ? moment(reportDate) : moment();

  const onDateSelect = (value) => {
    dispatch(changeSearchDate(value.format('DD-MM-YYYY')))
  }

  return (
    <Space>
      {/* <Select value={type} onChange={onTypeChange}>
        <Option value="monthly">Monthly</Option>
        <Option value="yearly">Yearly</Option>
      </Select> */}
      <PickerWithType type={type} defaultData={defaultDataValue} onChange={(value) => onDateSelect(value)} />
    </Space>
  );
};

export default SwitchablePicker;
