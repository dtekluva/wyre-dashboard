import React, { useEffect, useContext, useState } from 'react';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';
import { notification, Form, Spin, DatePicker, Select, Table, Dropdown, Menu, Space, Popconfirm, Modal, Button } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import CompleteDataContext from '../Context';

import moment from 'moment'; 
import BreadCrumb from '../components/BreadCrumb';
import Loader from '../components/Loader';
import { addFuelConsumptionData, addMonthlyFuelConsumptionData, fetchDieselDailyUsageData, fetchDieselMonthlyUsageData, fetchFuelConsumptionData, getBranchGeneratorsData } from '../redux/actions/constTracker/costTracker.action';
import { DateField, NumberField, SelectField, SelectGenerator } from '../components/FormFields/GeneralFormFields';
import { Option } from 'antd/lib/mentions';
import UnAuthorizeResponse from './UnAuthorizeResponse';
import { Icon } from '@iconify/react/dist/iconify.js';
import UpdateDieselEntry from './UpdateDieselEntry';


const { RangePicker } = DatePicker

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/cost-tracker', name: 'Cost Tracker', id: 2 },
  { url: '#', name: 'Add Diesel Entry', id: 3 },
];

const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Created',
    description: `New entry has been added to the ${formName} successfully`,
  });
};

const errorNotificationWithIcon = (type, errorMsg) => {
  notification[type]({
    message: 'Failed',
    description: errorMsg
  });
};

const NotAllowedNotification = () => {
  notification.error({
    message: 'Request Error',
    description: 'NOT ALLOWED',
    duration: 5
  })
}

function AddDieselEntry({
  match,
  costTracker,
  addFuelConsumptionData: addFuelConsumption,
  addMonthlyFuelConsumptionData: addMonthlyConsumption,
  getBranchGeneratorsData,
  fetchDieselDailyUsageData,
  fetchDieselMonthlyUsageData,
  fetchFuelConsumptionData: fetchFuelConsumptionInfo,
  deleteFuelConsumptionData: deleteDieselEntry
}) {
  const [entryType, setEntryType] = useState(null);
  const [dailyForm] = Form.useForm();
  const [monthlyForm] = Form.useForm();
  const [holdBranchGenerators, setHoldBranchGenerators] = useState([]);

  const [modalOpener, setModalOpener] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [modalDataMonthly, setModalDataMonthly] = useState(false);
  const [flattenedModalData, setFlattenedModalData] = useState(false);
  const [fuelDataLoading, setFuelDataLoading] = useState(false);
  const [editDieselEntryModal, setEditDieselEntryModal] = useState(false)
  const [dieselEntryData, setDieselEntryData] = useState({})
  const [dataSources, setDataSources] = useState({})

  const { setCurrentUrl, userId, userData } = useContext(
    CompleteDataContext
  );

  const isOperator = userData.role_text === "OPERATOR";

  const canEditRecord = (recordTime) => {
  if (!recordTime) return false;

  const now = moment();
  const recTime = moment(recordTime);

  const diffInMinutes = now.diff(recTime, "minutes");

  return diffInMinutes <= 30;  // allows editing only within 30 mins
};


  const sideBarData = useSelector((state) => state.sideBar.sideBarData);
  let defaultBranch;
  if (sideBarData.branches) {
    defaultBranch = sideBarData.branches[0].branch_id
  }

  let generatorList
  if (holdBranchGenerators) {
    generatorList = holdBranchGenerators.flat()
  }

  const data = {
    quantity: {
      label: 'Quantity',
      name: 'quantity',
      placeholder: 'Enter Quantity'
    },
    purchaseDate: {
      label: 'Date',
      name: 'date'
    },
    fuelType: {
      name: 'fuelType',
      label: 'Fuel Type',
      optionData: ['diesel'],
      placeholder: 'Select Fuel Type'
    },
  }
  
  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, userId]);

  useEffect(() => {
    if (defaultBranch) {   
      getBranchGeneratorsData(defaultBranch)
    }
  }, [defaultBranch]);

  useEffect(() => {
    if (costTracker?.fetchedListOfGenerators?.generators) {
      setHoldBranchGenerators(costTracker.fetchedListOfGenerators.generators)
    }
  },[costTracker.fetchedListOfGenerators.generators])

  const optionsColumn = {
    title: "Action",
    key: "action",
    align: "center",
    render: (_, record) => {
      const isEditable = canEditRecord(record.record_time);

      return (
        <Button
          type="primary"
          icon={<EditOutlined />}
          disabled={!isEditable}
          style={{
            borderRadius: "6px",
            fontWeight: 500,
            background: isEditable ? "#5c3592" : "#d9d9d9",
            borderColor: isEditable ? "#5c3592" : "#d9d9d9"
          }}
          onClick={() => {
            if (!isEditable) return;
            setDieselEntryData(record);
            setEditDieselEntryModal(true);
          }}
        >
          {isEditable ? "Edit" : "Locked"}
        </Button>
      );
    },
  };

  const formatEntryDate = (record) => {
    const { date, start_date, end_date } = record;

    // A. Single explicit date from backend (daily entry)
    if (date && !start_date && !end_date) {
      return moment(date).format("DD-MMM-YYYY");
    }

    // B. True date range (start_date != end_date)
    if (start_date && end_date && start_date !== end_date) {
      return `${moment(start_date).format("DD-MMM-YYYY")} → ${moment(
        end_date
      ).format("DD-MMM-YYYY")}`;
    }

    // C. Fake date range (start == end) → treat as single
    if (start_date) {
      return moment(start_date).format("DD-MMM-YYYY");
    }

    return "";
  };

  const sortByDate = (a, b) => {
    // Prioritize explicit date
    const dateA = a.date || a.start_date;
    const dateB = b.date || b.start_date;

    return moment(dateA).toDate() - moment(dateB).toDate();
  };

  const fetchDailyFuelData = async (date) => {
    setModalData(false)
    const year = moment(date).format('YYYY');
    const month = moment(date).endOf('month').format('MM');
    setModalOpener(true);
    setFuelDataLoading(true);
    const fuelData = await fetchDieselDailyUsageData(); 

    if (fuelData && fuelData.fullfilled) {
      const newData = fuelData.data.map((elementData) => ({
        fuel_consumption_id: elementData.fuel_consumption_id,
        start_date: elementData.start_date,
        end_date: elementData.end_date,
        quantity: elementData.quantity,
        record_time: elementData.record_time,
        generator_name: elementData.generator_name,
      }));
      // Sort by date (newest first)
      const sortedData = newData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      // Take the latest 10 entries
      setModalData(sortedData.slice(0, 10));
    }
    setFuelDataLoading(false);
  }

  const fetchMonthlyFuelData = async (date) => {
    setModalDataMonthly(false)
    setModalOpener(true);
    setFuelDataLoading(true);
    const fuelData = await fetchDieselMonthlyUsageData(); 

    if (fuelData && fuelData.fullfilled) {
      const newData = fuelData.data.map((elementData) => ({
        month: elementData.month,
        year: elementData.year,
        quantity: elementData.quantity,
        record_time: elementData.record_time,
        fuel_consumption_id: elementData.fuel_consumption_id,
      }));
      // Sort by date (newest first)
      const sortedData = newData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      // Take the latest 10 entries
      setModalDataMonthly(sortedData.slice(0, 10));
    }
    setFuelDataLoading(false);
  }

  useEffect(() => {
    fetchDailyFuelData()
    fetchMonthlyFuelData()
  }, []);

  const dailyConsumptionColumn = [
    {
      title: "Date",
      key: "date",
      render: (_, record) => {
        const isRange = record.start_date && record.end_date && record.start_date !== record.end_date;

        return (
          <span style={{
            color: isRange ? "#8a2be2" : "#333",
            fontWeight: isRange ? 600 : 400
          }}>
            {formatEntryDate(record)}
          </span>
        );
      },
      sorter: (a, b) => sortByDate(a, b),
      width: "25%",
    },
    {
      title: 'Quantity(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      align: "center",
    },
    {
      title: 'Generator',
      dataIndex: 'generator_name',
      key: 'generator_name',
      align: "center",
    },
    optionsColumn
  ];

  const monthlyConsumptionColumn = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: "month",
      width: '20%',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: "year",
      align: "center",
    },
    {
      title: 'Quantity(L)',
      dataIndex: 'quantity',
      key: 'quantitys',
      align: "center",
    },
    optionsColumn
  ];

  const onDailyDieselEntrySubmit = ({ from_date, to_date, quantity, fuelType, generator_ids }) => {
    Modal.confirm({
      title: "Confirm Submission",
      content:
        "After submitting, you will NOT be able to edit this entry after 30 minutes. Do you wish to continue?",
      okText: "Yes, Submit",
      cancelText: "Cancel",
      onOk: async () => {
        if (!defaultBranch) {
          NotAllowedNotification();
          return;
        }
        const branch = sideBarData.branches[0].branch_id;
        const startDate = from_date.format("YYYY-MM-DD");
        const endDate = to_date ? to_date.format("YYYY-MM-DD") : startDate;
        const parameters = {
          quantity,
          start_date: startDate,
          end_date: endDate,
          fuel_type: fuelType,
          generator_ids: [generator_ids],
          consumption_type: "Daily",
        };
        try {
          const request = await addFuelConsumption(branch, parameters);
          if (request.message.status === 201) {
            openNotificationWithIcon("success", "daily diesel entry");
            fetchDailyFuelData();
            dailyForm.resetFields();
            return;
          }
          if (request.message.response?.status === 400) {
            errorNotificationWithIcon("error", request.message.response.data.error);
            dailyForm.resetFields();
            return;
          }
          errorNotificationWithIcon("error", "Something went wrong, please try again");
          dailyForm.resetFields();
        } catch (err) {
          errorNotificationWithIcon("error", "Request failed");
        }
      },
    });
  };

  const onMonthDiesEntrySubmit = ({ date, quantity, fuelType }) => {
    Modal.confirm({
      title: "Confirm Submission",
      content:
        "After submitting, you will NOT be able to edit this entry after 30 minutes. Do you wish to continue?",
      okText: "Yes, Submit",
      cancelText: "Cancel",
      onOk: async () => {
        if (defaultBranch != null) {
          const branch = sideBarData.branches[0].branch_id
          const parameters = {
            branch,
            start_date: moment(date[0]).format("YYYY-MM-DD"),
            quantity: quantity,
            end_date: moment(date[1]).format("YYYY-MM-DD"),
            fuel_type: fuelType,
            consumption_type: "Monthly"
          };
          const request = await addMonthlyConsumption(branch, parameters);
          if (request.fullfilled) {
            openNotificationWithIcon('success', 'monthly diesel entry');
            fetchMonthlyFuelData()
            return monthlyForm.resetFields();
          }
          errorNotificationWithIcon('error', request.message.error)
          return monthlyForm.resetFields();
        }
        else {
          NotAllowedNotification();
        }
      },
    });
  }

  // run loader if data is loading
  if (!sideBarData.branches) {
    return <Loader />;
  }

  return (
    <>
      {isOperator ? (
        <>
          <div className="breadcrumb-and-print-buttons">
            <BreadCrumb routesArray={breadCrumbRoutes} />
          </div>

          <div className="cost-tracker-forms-content-wrapper">
            <h1 className="center-main-heading">Add Diesel Entry</h1>

            {/* 🔹 Entry Type Selector */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <Select
                placeholder="Select Entry Type"
                size="large"
                style={{ width: 280 }}
                onChange={setEntryType}
                value={entryType}
              >
                <Option value="daily">Daily Entry</Option>
                <Option value="monthly">Monthly Entry</Option>
              </Select>
            </div>

            {/* 🔸 Default message */}
            {!entryType && (
              <p style={{ textAlign: "center", color: "#888", marginTop: 50 }}>
                Please select an entry type to continue.
              </p>
            )}

            {/* 🔹 DAILY ENTRY */}
            {entryType === "daily" && (
              <>
                <section className="cost-tracker-form-section add-bills-section">
                  <Spin spinning={false}>
                    <h2 className="form-section-heading add-bills-section__heading">
                      Daily Diesel Entry
                    </h2>
                    <Form
                      form={dailyForm}
                      name="diesel-purchase"
                      initialValues={{ fuelType: "diesel" }}
                      className="cost-tracker-form"
                      onFinish={onDailyDieselEntrySubmit}
                    >
                      <div className="cost-tracker-form-inputs-wrapper">
                        {/* FROM DATE */}
                        <div className="cost-tracker-input-container">
                          <Form.Item
                            label="From Date"
                            name="from_date"
                            labelCol={{ span: 24 }}
                            hasFeedback
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[{ required: true, message: "Please select start date" }]}
                          >
                            <DatePicker
                              placeholder="Select start date"
                              size="large"
                              style={{ width: "100%" }}
                              format="DD-MMM-YYYY"
                              onChange={(date) => {
                                if (date) {
                                  const currentTo = dailyForm.getFieldValue("to_date");
                                  if (!currentTo || date.isAfter(currentTo)) {
                                    dailyForm.setFieldsValue({ to_date: date });
                                  }
                                } else {
                                  dailyForm.setFieldsValue({ to_date: null });
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                        {/* TO DATE (optional) */}
                        <div className="cost-tracker-input-container">
                          <Form.Item
                            label="To Date (optional)"
                            name="to_date"
                            labelCol={{ span: 24 }}
                            hasFeedback
                            validateTrigger={["onChange", "onBlur"]}
                          >
                            <DatePicker
                              placeholder="Select end date (optional)"
                              size="large"
                              style={{ width: "100%" }}
                              format="DD-MMM-YYYY"
                              disabledDate={(current) => {
                                const fromDate = dailyForm.getFieldValue("from_date");
                                return fromDate && current && current.isBefore(fromDate, "day");
                              }}
                            />
                          </Form.Item>
                        </div>
                        {/* QUANTITY */}
                        <div className="cost-tracker-input-container">
                          <Form.Item>
                            <NumberField data={data.quantity} />
                          </Form.Item>
                        </div>
                        {/* FUEL TYPE */}
                        <div className="cost-tracker-input-container">
                          <Form.Item>
                            <SelectField data={data.fuelType} />
                          </Form.Item>
                        </div>
                        {/* GENERATOR */}
                        <div className="cost-tracker-input-container">
                          <Form.Item
                            name="generator_ids"
                            label="Generator"
                            labelCol={{ span: 24 }}
                            hasFeedback
                            validateTrigger={["onChange", "onBlur"]}
                          >
                            <Select placeholder="Select Generator">
                              {generatorList.map((gen) => (
                                <Option key={gen.device_id} value={gen.device_id}>
                                  {gen.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      <button className="generic-submit-button cost-tracker-form-submit-button">
                        Submit
                      </button>
                    </Form>
                  </Spin>
                </section>
                {/* 🔹 DAILY TABLE */}
                <Table
                  dataSource={modalData}
                  columns={dailyConsumptionColumn}
                  loading={fuelDataLoading}
                  rowKey="fuel_consumption_id"
                  // pagination={{ pageSize: 6 }}
                />
                <Modal
                  visible={editDieselEntryModal}
                  onOk={() => setEditDieselEntryModal(false)}
                  onCancel={() => setEditDieselEntryModal(false)}
                  setDieselEntryData={setDieselEntryData}
                  width={1000}
                  footer={null}
                >
                  <UpdateDieselEntry
                    dieselEntryData={dieselEntryData}
                    holdBranchGenerators={holdBranchGenerators}
                    setModal={setEditDieselEntryModal}
                  />
                </Modal>
              </>
            )}

            {/* 🔹 MONTHLY ENTRY */}
            {entryType === "monthly" && (
              <div className="cost-tracker-forms-content-wrapper">
                <h2 className="center-main-heading">Add Monthly Diesel Entry</h2>
                <section className="cost-tracker-form-section add-bills-section">
                  <Spin spinning={false}>
                    <Form
                      form={monthlyForm}
                      name="diesel-purchase"
                      initialValues={{ fuelType: "diesel" }}
                      className="cost-tracker-form"
                      onFinish={onMonthDiesEntrySubmit}
                    >
                      <div className="cost-tracker-form-inputs-wrapper">
                        <div className="cost-tracker-input-container">
                          <Form.Item
                            label="Date"
                            name="date"
                            labelCol={{ span: 24 }}
                            hasFeedback
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[{ required: true, message: "Please select date" }]}
                          >
                            <RangePicker
                              size="large"
                              style={{ width: "100%" }}
                              format="DD-MMM-YYYY"
                            />
                          </Form.Item>
                        </div>

                        <div className="cost-tracker-input-container">
                          <Form.Item>
                            <NumberField data={data.quantity} />
                          </Form.Item>
                        </div>

                        <div className="cost-tracker-input-container">
                          <Form.Item>
                            <SelectField data={data.fuelType} />
                          </Form.Item>
                        </div>
                      </div>

                      <button className="generic-submit-button cost-tracker-form-submit-button">
                        Submit
                      </button>
                    </Form>
                  </Spin>
                </section>
                {/* Monthly Table */}
                <Table
                  dataSource={modalDataMonthly}
                  columns={monthlyConsumptionColumn}
                  loading={fuelDataLoading}
                  rowKey="start_date"
                  pagination={{ pageSize: 6 }}
                />
                <Modal
                  visible={editDieselEntryModal}
                  onOk={() => setEditDieselEntryModal(false)}
                  onCancel={() => setEditDieselEntryModal(false)}
                  setDieselEntryData={setDieselEntryData}
                  width={1000}
                  footer={null}
                >
                  <UpdateDieselEntry
                    dieselEntryData={dieselEntryData}
                    setModal={setEditDieselEntryModal}
                  />
                </Modal>
              </div>
            )}
          </div>
        </>
      ) : (
        <UnAuthorizeResponse />
      )}
    </>
);

}

const mapStateToProps = (state) => ({
  costTracker: state.costTracker,
});

const mapDispatchToProps = {
  addFuelConsumptionData,
  getBranchGeneratorsData,
  addMonthlyFuelConsumptionData,
  fetchFuelConsumptionData,
  fetchDieselDailyUsageData,
  fetchDieselMonthlyUsageData
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDieselEntry);