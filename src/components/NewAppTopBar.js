import { useContext, useEffect, useState } from 'react';
import { Tag, DatePicker, TimePicker, Form, Modal, Space } from 'antd';
import CompleteDataContext from '../Context';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import moment from 'moment';
import dataHttpServices from '../services/devices';

dayjs.extend(quarterOfYear);

const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;

// default pickers (dayjs – antd v6 uses dayjs)
const picker = {
  Today: [dayjs().startOf('day'), dayjs()],
  Yesterday: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
  'Past Week': [dayjs().subtract(7, 'day').startOf('day'), dayjs()],
  'Past Month': [dayjs().subtract(1, 'month').startOf('day'), dayjs()],
  'Past Quarter': [dayjs().startOf('quarter').startOf('day'), dayjs()],
  'Past Half Year': [dayjs().subtract(6, 'month').startOf('day'), dayjs()],
  'Past Year': [dayjs().subtract(1, 'year').startOf('day'), dayjs()],
};

function NewAppTopBar() {
  const {
    setUserDateRange,
    setSelectedDateRange,
  } = useContext(CompleteDataContext);


  const [selectedDate, setSelectedDate] = useState([dayjs().startOf('month').startOf('day'), dayjs()]);
  const [showMonths, setShowMonths] = useState(false);
  const [showDays, setShowDays] = useState(false);
  const [showQuarters, setShowQuarters] = useState(false);
  const [showHalfYears, setShowHalfYears] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showWeeks, setShowWeeks] = useState(false);
  const [componentText, setComponentText] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      from: selectedDate[0],
      to: selectedDate[1],
      timeFrom: selectedDate[0],
      timeTo: selectedDate[1],
    })

  }, [selectedDate, form]);

  const setDateValueOnSelect = (startDate, endDate) => {
    let newStartDate = startDate;
    let newEndDate = endDate;
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      newStartDate = dayjs(endDate).startOf('day');
    }
    return [newStartDate, newEndDate];
  };

  // day select handler
  const onDaySelect = (day) => {
    setSelectedDate(setDateValueOnSelect(
      selectedDate[0].date(day).startOf('day'),
      selectedDate[1].date(day).endOf('day')
    ));
  };

  // month select handler (month is short name 'Jan','Feb',... from PickMonth; dayjs month is 0-indexed)
  const onMonthSelect = (monthName) => {
    const monthIndex = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMM')).indexOf(monthName);
    if (monthIndex === -1) return;
    if (componentText === 'Select Month') {
      return setSelectedDate([
        selectedDate[0].month(monthIndex).startOf('month').startOf('day'),
        selectedDate[1].month(monthIndex).endOf('month').endOf('day'),
      ]);
    }
    setSelectedDate([
      selectedDate[0].month(monthIndex).startOf('day'),
      selectedDate[1].month(monthIndex).endOf('day'),
    ]);
  };

  // year select handler
  const onYearSelect = (year) => {
    if (componentText === 'Select Year') {
      setSelectedDate([
        selectedDate[0].year(year).startOf('year').startOf('day'),
        selectedDate[1].year(year).endOf('year').endOf('day'),
      ]);
      return;
    }
    setSelectedDate([
      selectedDate[0].year(year).startOf('day'),
      selectedDate[1].year(year).endOf('day'),
    ]);
  };

  // Quarter select handler
  const onQuarterSelect = (quarter) => {
    if (componentText === 'Select Quarter') {
      return setSelectedDate([
        selectedDate[0].quarter(quarter).startOf('quarter').startOf('day'),
        selectedDate[0].quarter(quarter).endOf('quarter').endOf('day'),
      ]);
    }
  };

  const onWeekSelect = (week) => {
    if (componentText === 'Select Week') {
      return setSelectedDate([
        dayjs().subtract((week * 7) - 1, 'day').startOf('day'),
        dayjs().endOf('day'),
      ]);
    }
  };

  // half year select handler
  const onHalfYearSelect = (half) => {
    const quarterValue = half > 1 ? 3 : 1;
    if (componentText === 'Select Half Year') {
      return setSelectedDate([
        selectedDate[0].quarter(quarterValue).startOf('quarter').startOf('day'),
        selectedDate[0].quarter(quarterValue + 1).endOf('quarter').endOf('day'),
      ]);
    }
  };


  // on date search submit (convert dayjs to moment for API/context)
  const onApplyClick = () => {
    const start = moment(selectedDate[0].toISOString());
    const end = moment(selectedDate[1].toISOString());
    dataHttpServices.setEndpointDateRange([start, end]);
    setUserDateRange([start, end]);
    setSelectedDateRange([
      selectedDate[0].format('DD-MM-YYYY HH:mm'),
      selectedDate[1].format('DD-MM-YYYY HH:mm'),
    ]);
    setOpenModal(false);
  };

  // on open day select handler for when open day is selected
  const openDaySelectButtonClick = (checked) => {
    setComponentText('Select Day');

    if (checked) {
      setSelectedDate([dayjs().startOf('day'), dayjs()]);
    }
    setShowYears(checked);
    setShowMonths(checked);
    setShowDays(checked);
    setShowHalfYears(false);
    setShowQuarters(false);
    setShowWeeks(false);
  };

  // open month select handler to open the component
  const openMonthSelectButtonClick = (checked) => {
    setComponentText("Select Month");
    if (checked) {
      setSelectedDate([dayjs().startOf('month').startOf('day'), dayjs()]);
    }
    setShowYears(checked);
    setShowMonths(checked);
    setShowHalfYears(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowWeeks(false);
  };

  // open quarter select handler to open the component
  const onOpenQuarterSelectButton = (checked) => {
    setComponentText("Select Quarter");
    if (checked) {
      setSelectedDate([dayjs().startOf('quarter').startOf('day'), dayjs()]);
    }
    setShowYears(checked);
    setShowQuarters(checked);
    setShowMonths(false);
    setShowDays(false);
    setShowHalfYears(false);
    setShowWeeks(false);
  };

  // open year select handler to open the component
  const onOpenPastYearSelectButton = (checked) => {
    setComponentText("Select Year");
    if (checked) {
      setSelectedDate([dayjs().startOf('year').startOf('day'), dayjs()]);
    }
    setShowYears(checked);
    setShowMonths(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowHalfYears(false);
    setShowWeeks(false);
  };

  // open half year select handler to open the component
  const onOpenHalfYearSelectButton = (checked) => {
    setComponentText("Select Half Year");
    if (checked) {
      const quarterValue = dayjs().quarter() > 2 ? 3 : 1;
      setSelectedDate([
        selectedDate[0].quarter(quarterValue).startOf('quarter').startOf('day'),
        selectedDate[0].quarter(quarterValue + 1).endOf('quarter').endOf('day'),
      ]);
    }
    setShowHalfYears(checked);
    setShowYears(checked);
    setShowMonths(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowWeeks(false);
  };

  // check half year date
  const checkedHalfYear = (value) => {
    if (selectedDate[0].quarter() > 2 && value === 2) return true;
    if (selectedDate[0].quarter() < 3 && value === 1) return true;
    return false;
  };

  // handle when user select a calendar (antd passes dayjs)
  const onFirstCalendarClick = (date) => {
    setComponentText(false);
    const d = dayjs(date);
    if (d.isBefore(dayjs(), 'day')) {
      return setSelectedDate(setDateValueOnSelect(d.startOf('day'), selectedDate[1]));
    }
    setSelectedDate(setDateValueOnSelect(
      d.set('hour', dayjs().hour()).set('minute', dayjs().minute()).set('second', dayjs().second()),
      selectedDate[1]
    ));
  };

  // handle when user select the second calendar
  const onSecondCalendarClick = (date) => {
    setComponentText(false);
    const d = dayjs(date);
    if (d.isBefore(dayjs(), 'day')) {
      return setSelectedDate(setDateValueOnSelect(selectedDate[0], d.endOf('day')));
    }
    setSelectedDate(setDateValueOnSelect(selectedDate[0], d.set('hour', dayjs().hour()).set('minute', dayjs().minute()).set('second', dayjs().second())));
  };

  // handle when user select the first time (antd passes dayjs)
  const onFirstTimeClick = (time) => {
    setComponentText(false);
    setSelectedDate([
      selectedDate[0].set('hour', time.hour()).set('minute', time.minute()),
      selectedDate[1],
    ]);
  };

  // handle when user select the second time
  const onSecondTimeClick = (time) => {
    setComponentText(false);
    setSelectedDate([
      selectedDate[0],
      selectedDate[1].set('hour', time.hour()).set('minute', time.minute()).set('second', time.second()),
    ]);
  };

  const onDefaultTagClick = (text) => {
    setComponentText(false);
    setSelectedDate(picker[text]);

    setShowYears(false);
    setShowMonths(false);
    setShowHalfYears(false);
    setShowDays(false);
    setShowQuarters(false);
    setShowWeeks(false);
  };

  const SelectTag = (data) => (
    <CheckableTag
      className="date-search-tag"
      style={{ width: "14%" }}
      onClick={() => onDefaultTagClick(data.text)}
    >
      {data.text}
    </CheckableTag>
  );
  const DefaultSelectTag = (data) => (
    <CheckableTag
      className="date-search-tag"
      style={{ width: "19%" }}
      checked={data.isChecked && data.text === componentText}
      onChange={data.clickCallBack}
    >
      {data.text}
    </CheckableTag>
  );
  const PickQuarterTag = (data) => (
    <CheckableTag
      className="date-search-tag"
      style={{ width: "24%" }}
      checked={data.isChecked}
      onChange={() => onQuarterSelect(data.quarter)}
    >
      {data.text}
    </CheckableTag>
  );
  const PickWeekTag = (data) => (
    <CheckableTag
      className="date-search-tag"
      style={{ width: "24%" }}
      onChange={() => onWeekSelect(data.week)}
    >
      {data.text}
    </CheckableTag>
  );

  const PickHalfYearTag = (data) => (
    <CheckableTag
      className="date-search-tag"
      style={{ width: "48%" }}
      checked={data.isChecked}
      onChange={() => onHalfYearSelect(data.half)}
    >
      {data.text}
    </CheckableTag>
  );

  const PickYear = (data) => (
    <CheckableTag
      onChange={() => onYearSelect(data.year)}
      checked={data.isChecked}
      style={{ width: "20%" }}
      className="date-search-tag"
    >
      {data.year}
    </CheckableTag>
  );

  const PickMonth = (data) => (
    <CheckableTag
      className="date-search-tag"
      style={{ width: "7.8%" }}
      checked={data.isChecked}
      onChange={() => onMonthSelect(data.month)}
    >
      {data.month}
    </CheckableTag>
  );

  const PickDay = (data) => (
    <p
      style={{
        backgroundColor: data.isChecked && "#5C3592",
        color: data.isChecked && "white",
        width: "2.9%",
      }}
      className="pickday-search-tag"
      onClick={() => onDaySelect(data.day)}
    >
      {data.day}
    </p>
  );

  // handles date range (current is dayjs from antd)
  const dateRender = (current) => {
    const style = {};
    style.color = 'rgba(0, 0, 0, 0.65)';
    style.backgroundColor = 'inherit';
    const start = selectedDate[0].startOf('day');
    const end = selectedDate[1].endOf('day');
    const inRange = (current.isAfter(start) || current.isSame(selectedDate[0], 'day'))
      && (current.isBefore(end) || current.isSame(selectedDate[1], 'day'));
    if (inRange) {
      style.border = '1px solid #1890ff';
      style.backgroundColor = '#5C3592';
      style.color = 'white';
    }
    return (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );
  };

  // the date that are disabled (antd passes dayjs)
  const disabledDate = (current) => current.isAfter(dayjs(), 'day') || null;

  const getPopupContainer = (trigger) => trigger.parentNode;

  const Content = () => (
    <div
      className="header-date-search"
      style={{
        display: "flex",
        flexDirection: "column",
        height: componentText ? 460 : 400,
      }}
    >
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <DefaultSelectTag
            text="Select Day"
            isChecked={showDays}
            clickCallBack={openDaySelectButtonClick}
          />
          <DefaultSelectTag
            text="Select Month"
            isChecked={showMonths}
            clickCallBack={openMonthSelectButtonClick}
          />
          <DefaultSelectTag
            text="Select Quarter"
            isChecked={showQuarters}
            clickCallBack={onOpenQuarterSelectButton}
          />
          <DefaultSelectTag
            text="Select Half Year"
            isChecked={showHalfYears}
            clickCallBack={onOpenHalfYearSelectButton}
          />
          <DefaultSelectTag
            text="Select Year"
            isChecked={showYears}
            clickCallBack={onOpenPastYearSelectButton}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <SelectTag text="Today" />
          <SelectTag text="Yesterday" />
          <SelectTag text="Past Week" />
          <SelectTag text="Past Month" />
          <SelectTag text="Past Quarter" />
          <SelectTag text="Past Half Year" />
          <SelectTag text="Past Year" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showYears && Array.from({ length: 5 }, (v, k) => dayjs().year() - 4 + k).map((year) => (
            <PickYear key={year} isChecked={year === selectedDate[0].year() && componentText} year={year} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showMonths && Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMM')).map((month) => (
            <PickMonth key={month} isChecked={month === selectedDate[0].format('MMM') && componentText} month={month} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showQuarters && Array.from({ length: 4 }, (v, k) => k + 1).map((quarter) => (
            <PickQuarterTag
              key={quarter}
              isChecked={quarter === selectedDate[0].quarter() && componentText}
              text={`Q${quarter}`} quarter={quarter} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showWeeks && Array.from({ length: 4 }, (v, k) => k + 1).map((week) => (
            <PickWeekTag key={week} text={`Past ${week} week`} week={week} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showHalfYears && Array.from({ length: 2 }, (v, k) => k + 1).map((half) => (
            <PickHalfYearTag key={half} isChecked={checkedHalfYear(half) && componentText} text={`${half} Half`} half={half} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          {showDays && Array.from({ length: dayjs().daysInMonth() }, (v, k) => k + 1).map((day) => (
            <PickDay key={day} isChecked={day === selectedDate[0].date() && componentText} day={day} />
          ))}
        </div>
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          initialValues={{
            from: selectedDate[0],
            to: selectedDate[1],
            timeFrom: selectedDate[0],
            timeTo: selectedDate[1],
          }}
        >
          <div className="header-date-component">
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                marginTop: 5,
                marginLeft: 2,
              }}
            >
              <div className="start-date">
                <Form.Item name="from" label="From">
                  <DatePicker
                    getPopupContainer={getPopupContainer}
                    getCalendarContainer={getPopupContainer}
                    dateRender={dateRender}
                    disabledDate={disabledDate}
                    open={true}
                    style={{ width: 170, marginLeft: 5 }}
                    onChange={onFirstCalendarClick}
                    className={"my-class"}
                  />
                </Form.Item>
              </div>
              <div
                className="start-time"
                style={{ marginLeft: 115, marginRight: 5 }}
              >
                <Form.Item name="timeFrom" label="Time">
                  <TimePicker
                    onSelect={onFirstTimeClick}
                    style={{ width: 55 }}
                    format={"HH"}
                    getPopupContainer={getPopupContainer}
                    open={true}
                  />
                </Form.Item>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                marginTop: 5,
                marginLeft: 2,
              }}
            >
              <div className="end-date">
                <Form.Item name="to" label="To">
                  <DatePicker
                    onChange={onSecondCalendarClick}
                    getCalendarContainer={getPopupContainer}
                    dateRender={dateRender}
                    disabledDate={disabledDate}
                    className={"my-class"}
                    style={{ width: 170 }}
                    getPopupContainer={getPopupContainer}
                    open={true}
                  />
                </Form.Item>
              </div>
              <div className="end-time" style={{ marginLeft: 115 }}>
                <Form.Item name="timeTo" label="Time">
                  <TimePicker
                    onSelect={onSecondTimeClick}
                    style={{ width: 55, marginRight: 5 }}
                    format={"HH"}
                    getPopupContainer={getPopupContainer}
                    open={true}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <Space
          className="date-range-picker-containers"
          direction="horizontal"
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
      </div>

      <Modal
        open={openModal}
        onOk={onApplyClick}
        okText="Apply"
        onCancel={() => setOpenModal(false)}
        closable={false}
        width={745}
      >
        <Content />
      </Modal>
    </>
  );
}

export default NewAppTopBar;
