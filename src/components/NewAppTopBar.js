import React, { useContext, useEffect, useState } from 'react';
import { Tag, DatePicker, TimePicker, Form, Modal, Space } from 'antd';
import CompleteDataContext from '../Context';
import moment from 'moment';
import dataHttpServices from '../services/devices';

const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;

// default pickers
const picker = {
  Today: [moment().startOf('day'), moment()],
  'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
  'Past Week': [moment('00:00:00', 'HH:mm:ss').subtract(7, 'days'), moment()],
  'Past Month': [moment('00:00:00', 'HH:mm:ss').subtract(1, 'months'), moment()],
  'Past Quarter': [moment().quarter(moment().quarter()).startOf('quarter').startOf('day'), moment()],
  'Past Half Year': [moment('00:00:00', 'HH:mm:ss').subtract(6, 'months'), moment()],
  'Past Year': [moment('00:00:00', 'HH:mm:ss').subtract(1, 'years'), moment()],
}

function NewAppTopBar() {
  const {
    setUserDateRange,
    setSelectedDateRange,
    currentUrl
  } = useContext(CompleteDataContext);


  const [selectedDate, setSelectedDate] = useState([moment().startOf('month').startOf('day'), moment()]);
  const [showMonths, setShowMonths] = useState(false);
  const [showDays, setShowDays] = useState(false);
  const [showQuarters, setShowQuarters] = useState(false);
  const [showHalfYears, setShowHalfYears] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showWeeks, setShowWeeks] = useState(false);
  const [componentText, setComponentText] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();


  const isTopBarCostTrackerRightDisplayed = currentUrl.includes('cost-tracker');

  useEffect(() => {
    form.setFieldsValue({
      from: selectedDate[0],
      to: selectedDate[1],
      timeFrom: selectedDate[0],
      timeTo: selectedDate[1],
    })

  }, [selectedDate]);


  const setDateValueOnSelect = (startDate, endDate) => {
    let newStartDate = startDate;
    let newEndDate = endDate;
    if (moment(startDate).isAfter(moment(endDate))) {
      newStartDate = moment(endDate).startOf('day');
    }
    return [newStartDate, newEndDate];
  }

  // day select handler
  const onDaySelect = (day) => {
    setSelectedDate(setDateValueOnSelect(moment(selectedDate[0]).set('date', day).startOf('day'),
      moment(selectedDate[1]).set('date', day).endOf('day')));
  }

  // month select handler
  const onMonthSelect = (month) => {
    if (componentText === 'Select Month') {
      return setSelectedDate([moment(selectedDate[0]).set('month', month).startOf('month').startOf('day'),
      moment(selectedDate[1]).set('month', month).endOf('month').endOf('day')]);
    }
    return setSelectedDate([moment(selectedDate[0]).set('month', month).startOf('day'),
    moment(selectedDate[1]).set('month', month).endOf('day')]);
  }
  // year select handler
  const onYearSelect = (year) => {
    if (componentText === 'Select Year') {
      setSelectedDate([moment(selectedDate[0]).set('year', year).startOf('year').startOf('day'),
      moment(selectedDate[1]).set('year', year).endOf('year').endOf('day')]);
    }
    return setSelectedDate([moment(selectedDate[0]).set('year', year).startOf('day'),
    moment(selectedDate[1]).set('year', year).endOf('day')]);
  }
  // Quarter select handler
  const onQuarterSelect = (quarter) => {
    if (componentText === 'Select Quarter') {
      return setSelectedDate([moment(selectedDate[0]).quarter(quarter).startOf('quarter').startOf('day'),
      moment(selectedDate[0]).quarter(quarter).endOf('quarter').endOf('day')]);
    }
  }
  const onWeekSelect = (week) => {
    if (componentText === 'Select Week') {
      return setSelectedDate([moment().subtract((week * 7) - 1, 'days').startOf('day'),
      moment().endOf('day')]);
    }
  }
  //half year select handler
  const onHalfYearSelect = (half) => {
    const quarterValue = half > 1 ? 3 : 1;
    if (componentText === 'Select Half Year') {

      return setSelectedDate([moment(selectedDate[0]).quarter(quarterValue).startOf('quarter').startOf('day'),
      moment(selectedDate[0]).quarter(quarterValue + 1).endOf('quarter').endOf('day')]);
    }
  }



  // on date search submit(to make the api call)
  const onApplyClick = () => {
    dataHttpServices.setEndpointDateRange(selectedDate);
    setUserDateRange(selectedDate);
    setSelectedDateRange([moment(selectedDate[0]).format('DD-MM-YYYY HH:mm'),
    moment(selectedDate[1]).format('DD-MM-YYYY HH:mm')]);
    setOpenModal(false);
  }

  // on open day select handler for when open day is selected
  const openDaySelectButtonClick = (checked) => {

    setComponentText('Select Day');

    if (checked) {
      // set the date to what to begining of day an dnow
      setSelectedDate([moment().startOf('day'), moment()]);
    }
    // setSearchCheckedDate(checked, setSelectedDate, moment().startOf('day'));
    setShowYears(checked);
    setShowMonths(checked);
    setShowDays(checked);
    setShowHalfYears(false);
    setShowQuarters(false);
    setShowWeeks(false);
  }

  // open month select handler to open the component
  const openMonthSelectButtonClick = (checked) => {
    setComponentText('Select Month');
    if (checked) {
      // set the date to what to begining of day an dnow
      setSelectedDate([moment().startOf('month').startOf('day'), moment()]);
    }
    setShowYears(checked);
    setShowMonths(checked);
    setShowHalfYears(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowWeeks(false);
  }

  // open quarter select handler to open the component
  const onOpenQuarterSelectButton = (checked) => {
    setComponentText('Select Quarter');
    if (checked) {
      // set the date to what to begining of day an dnow
      setSelectedDate([moment().startOf('quarter').startOf('day'), moment()]);
    }
    setShowYears(checked);
    setShowQuarters(checked);
    setShowMonths(false);
    setShowDays(false);
    setShowHalfYears(false);
    setShowWeeks(false);
  }

  // open year select handler to open the component
  const onOpenPastYearSelectButton = (checked) => {
    setComponentText('Select Year');
    if (checked) {
      // set the date to what to begining of day an dnow
      setSelectedDate([moment().startOf('year').startOf('day'), moment()]);
    }
    setShowYears(checked);
    setShowMonths(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowHalfYears(false);
    setShowWeeks(false);
  }

  // open half year select handler to open the component
  const onOpenHalfYearSelectButton = (checked) => {
    setComponentText('Select Half Year');
    if (checked) {
      const quarterValue = moment().quarter() > 2 ? 3 : 1;
      // set the date to what to begining of day an dnow
      setSelectedDate([moment(selectedDate[0]).quarter(quarterValue).startOf('quarter').startOf('day'),
      moment(selectedDate[0]).quarter(quarterValue + 1).endOf('quarter').endOf('day')]);
    }
    setShowHalfYears(checked);
    setShowYears(checked);
    setShowMonths(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowWeeks(false);
  }

  // check half year date
  const checkedHalfYear = (value) => {
    if (moment(selectedDate[0]).quarter() > 2 && value === 2) {
      return true;
    }
    if (moment(selectedDate[0]).quarter() < 3 && value === 1) {
      return true;
    }

  }

  // handle when user select a calendar 
  const onFirstCalendarClick = (date) => {

    setComponentText(false);
    if (moment(date).isBefore(moment())) {
      return setSelectedDate(setDateValueOnSelect(moment(date).startOf('day'), selectedDate[1]));
    }

    const currentTime = moment().startOf('day');
    
    setSelectedDate(setDateValueOnSelect(moment(date).set({
      hour: currentTime.get('hour'),
      minute: currentTime.get('minute'),
      second: currentTime.get('second')
    }), selectedDate[1]));
  }

  // handle when user select the second calendar 
  const onSecondCalendarClick = (date) => {
    setComponentText(false);
    if (moment(date).isBefore(moment())) {
      return setSelectedDate(setDateValueOnSelect(selectedDate[0], moment(date).endOf('day')));
    }
    const currentTime = moment();
    return setSelectedDate(setDateValueOnSelect(selectedDate[0], moment(date).set({
      hour: currentTime.get('hour'),
      minute: currentTime.get('minute'),
      second: currentTime.get('second')
    })));
  }

  // handle when user select the first time 
  const onFirstTimeClick = (time) => {
    setComponentText(false);
    setSelectedDate([moment(selectedDate[0]).set({
      hour: time.get('hour'),
      minute: '20',
    }), selectedDate[1]]);
  }

  // handle when user select the first second
  const onSecondTimeClick = (time) => {
    setComponentText(false);
    setSelectedDate([selectedDate[0], moment(selectedDate[1]).set({
      hour: time.get('hour'),
      minute: '20',
      second: time.get('second')
    })]);
  }

  const onDefaultTagClick = (text) => {
    setComponentText(false);
    setSelectedDate(picker[text]);

    setShowYears(false);
    setShowMonths(false);
    setShowHalfYears(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowWeeks(false);
  }

  const SelectTag = (data) => (
    <CheckableTag className='date-search-tag'
      style={{ width: '14%' }}
      onClick={() => onDefaultTagClick(data.text)}>{data.text}</CheckableTag>
  )
  const DefaultSelectTag = (data) => (
    <CheckableTag className='date-search-tag'
      style={{ width: '19%' }}
      checked={data.isChecked && data.text === componentText}
      onChange={data.clickCallBack}>{data.text}</CheckableTag>
  )
  const PickQuarterTag = (data) => (
    <CheckableTag className='date-search-tag' style={{ width: '24%' }}
      checked={data.isChecked}
      onChange={() => onQuarterSelect(data.quarter)}>{data.text}</CheckableTag>
  )
  const PickWeekTag = (data) => (
    <CheckableTag className='date-search-tag' style={{ width: '24%' }}
      onChange={() => onWeekSelect(data.week)}>{data.text}</CheckableTag>
  );

  const PickHalfYearTag = (data) => (
    <CheckableTag className='date-search-tag' style={{ width: '48%' }}
      checked={data.isChecked}
      onChange={() => onHalfYearSelect(data.half)}>{data.text}</CheckableTag>
  );

  const PickYear = (data) => (
    <CheckableTag onChange={() => onYearSelect(data.year)} checked={data.isChecked}
      style={{ width: '20%' }} className='date-search-tag'
    >{data.year}</CheckableTag>
  );

  const PickMonth = (data) => (
    <CheckableTag className='date-search-tag'
      style={{ width: '7.8%' }}
      checked={data.isChecked} onChange={() => onMonthSelect(data.month)}
    >{data.month}</CheckableTag>
  )

  const PickDay = (data) => (
    <p style={{
      backgroundColor: data.isChecked && '#6c00fa',
      color: data.isChecked && 'white',
      width: '2.9%'
    }}
      className='pickday-search-tag' onClick={() => onDaySelect(data.day)} >{data.day}</p>
  )

  // handles date range
  const dateRender = (current) => {
    const style = {};
    style.color = 'rgba(0, 0, 0, 0.65)';
    style.backgroundColor = 'inherit';

    if (current.isSameOrAfter(selectedDate[0])
      && current.isSameOrBefore(selectedDate[1])) {

      style.border = '1px solid #1890ff';
      style.backgroundColor = '#6c00fa';
      style.color = 'white'
    }
    return (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );
  };

  // the date that are disabled
  const disabledDate = (current) => current.isAfter(moment()) || null;

  const getPopupContainer = (trigger) => trigger.parentNode;


  const Content = () => (
    <div className='header-date-search' style={{
      display: 'flex', flexDirection: 'column',
      height: componentText ? 460 : 400
    }} >
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          <DefaultSelectTag text='Select Day' isChecked={showDays} clickCallBack={openDaySelectButtonClick} />
          {/* <DefaultSelectTag text='Select Week' isChecked={showWeeks} clickCallBack={onOpenWeekSelectButton} /> */}
          <DefaultSelectTag text='Select Month' isChecked={showMonths} clickCallBack={openMonthSelectButtonClick} />
          <DefaultSelectTag text='Select Quarter' isChecked={showQuarters} clickCallBack={onOpenQuarterSelectButton} />
          <DefaultSelectTag text='Select Half Year' isChecked={showHalfYears} clickCallBack={onOpenHalfYearSelectButton} />
          <DefaultSelectTag text='Select Year' isChecked={showYears} clickCallBack={onOpenPastYearSelectButton} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          <SelectTag text='Today' />
          <SelectTag text='Yesterday' />
          <SelectTag text='Past Week' />
          <SelectTag text='Past Month' />
          <SelectTag text='Past Quarter' />
          <SelectTag text='Past Half Year' />
          <SelectTag text='Past Year' />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showYears && Array.from({ length: 5 }, (v, k) => (moment().year() - 4) + k).map((year) => {
            return <PickYear isChecked={year === moment(selectedDate[0]).year()
              && componentText} year={year} />
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showMonths && moment.monthsShort().map((month) => {
            return <PickMonth isChecked={month === moment(selectedDate[0]).format('MMM')
              && componentText} month={month} />
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showQuarters && Array.from({ length: 4 }, (v, k) => k + 1).map((quarter) => {
            return <PickQuarterTag
              isChecked={quarter === moment(selectedDate[0]).quarter() && componentText}
              text={`Q${quarter}`} quarter={quarter} />
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showWeeks && Array.from({ length: 4 }, (v, k) => k + 1).map((week) => {
            return <PickWeekTag text={`Past ${week} week`} week={week} />
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showHalfYears && Array.from({ length: 2 }, (v, k) => k + 1).map((half) => {
            return <PickHalfYearTag isChecked={checkedHalfYear(half) && componentText}
              text={`${half} Half`} half={half} />
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showDays && Array.from({ length: moment().daysInMonth() }, (v, k) => k + 1).map((day) => {
            return <PickDay isChecked={day === moment(selectedDate[0]).date()
              && componentText} day={day} />
          })}
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          initialValues={{
            from: selectedDate[0],
            to: selectedDate[1],
            timeFrom: selectedDate[0],
            timeTo: selectedDate[1]
          }}
        >
          <div className='header-date-component' >
            <div style={{
              position: 'relative',
              display: 'flex', flexDirection: 'row',
              marginTop: 5,
              marginLeft: 2
            }}>
              <div className='start-date'>
                <Form.Item name="from" label="From">
                  <DatePicker
                    getPopupContainer={getPopupContainer}
                    getCalendarContainer={getPopupContainer}
                    dateRender={dateRender}
                    disabledDate={disabledDate}
                    open={true}
                    style={{ width: 170, marginLeft: 5 }}
                    onChange={onFirstCalendarClick}
                    className={'my-class'} />
                </Form.Item>
              </div>
              <div className='start-time' style={{ marginLeft: 115, marginRight: 5 }}>
                <Form.Item name="timeFrom" label="Time">
                  <TimePicker onSelect={onFirstTimeClick} style={{ width: 55 }} format={'HH'}
                    getPopupContainer={getPopupContainer} open={true} />
                </Form.Item>
              </div>
            </div>
            <div style={{
              position: 'relative',
              display: 'flex', flexDirection: 'row',
              marginTop: 5,
              marginLeft: 2
            }}>
              <div className='end-date' >
                <Form.Item name="to" label="To">
                  <DatePicker
                    onChange={onSecondCalendarClick}
                    getCalendarContainer={getPopupContainer}
                    dateRender={dateRender}
                    disabledDate={disabledDate}
                    className={'my-class'}
                    style={{ width: 170 }}
                    getPopupContainer={getPopupContainer}
                    open={true} />
                </Form.Item>
              </div>
              <div className='end-time' style={{ marginLeft: 115 }}>
                <Form.Item name="timeTo" label="Time">
                  <TimePicker onSelect={onSecondTimeClick}
                    style={{ width: 55, marginRight: 5 }}
                    format={'HH'}
                    getPopupContainer={getPopupContainer} open={true} />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );

  return (
    <div >
      {/* <div> */}
      {/* <Popover placement="rightBottom" trigger="click" content={content} width={'800px'} style={{ width: '100%' }} >
        <Button>RB</Button>
      </Popover> */}
      <>
        <Space
          className="date-range-picker-containers"
          direction="vertical"
          size={12}
          onClick={() => setOpenModal(!openModal)}
        >
          <RangePicker
            className="date-range-picker"
            value={selectedDate}
            onClick={() => setOpenModal(!openModal)}
            format="DD-MM-YYYY HH:mm"
            open={false}
            inputReadOnly={true}
          />
        </Space>
      </>
      {
        openModal &&
        <Modal
          onOk={onApplyClick}
          okText='Apply'
          onCancel={() => setOpenModal(!openModal)}
          closable={false}
          width={745}
          visible={openModal} >
          <Content />
        </Modal>
      }

      {/* </div> */}
    </div>
  );
}

export default NewAppTopBar;
