import React, { useEffect, useContext, useState } from 'react';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';
import { notification, Form, Spin, DatePicker, Select, Table, Dropdown, Menu, Space, Popconfirm } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import CompleteDataContext from '../Context';

import moment from 'moment'; 
import BreadCrumb from '../components/BreadCrumb';
import Loader from '../components/Loader';
import { addFuelConsumptionData, addMonthlyFuelConsumptionData, fetchFuelConsumptionData, getBranchGeneratorsData } from '../redux/actions/constTracker/costTracker.action';
import { DateField, NumberField, SelectField, SelectGenerator } from '../components/FormFields/GeneralFormFields';
import { Option } from 'antd/lib/mentions';
import UnAuthorizeResponse from './UnAuthorizeResponse';
import { Icon } from '@iconify/react/dist/iconify.js';


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
  fetchFuelConsumptionData: fetchFuelConsumptionInfo,
  deleteFuelConsumptionData: deleteDieselEntry
}) {
  const [entryType, setEntryType] = useState(null);
  const [dailyForm] = Form.useForm();
  const [monthlyForm] = Form.useForm();
  const [holdBranchGenerators, setHoldBranchGenerators] = useState([]);

  const [modalOpener, setModalOpener] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [flattenedModalData, setFlattenedModalData] = useState(false);
  const [fuelDataLoading, setFuelDataLoading] = useState(false);
  const [editDieselEntryModal, setEditDieselEntryModal] = useState(false)
  const [dieselEntryData, setDieselEntryData] = useState({})
  const [dataSources, setDataSources] = useState({})

  const { setCurrentUrl, userId, userData } = useContext(
    CompleteDataContext
  );

  const isOperator = userData.role_text === "OPERATOR";
  const entryId = dieselEntryData.fuel_consumption_id

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

  const handleDelete = async () => {
    const parameter = {
      id: entryId
    };
    const request = await deleteDieselEntry(entryId, parameter);
    if (request.fullfilled) {
      openNotificationWithIcon("success", "daily diesel entry");
    }
    errorNotificationWithIcon("Failed", "daily diesel entry");
  };

  const itemData = (record) => {
      return [
        {
          key: '1',
          label: (
            <>
              <EditOutlined />
              <a target="_blank" onClick={(e) => {
                e.preventDefault();
                setEditDieselEntryModal(true);
                setDieselEntryData(record)
              }} rel="noopener noreferrer">
                Edit Diesel Entry
              </a>
            </>
  
          ),
        },
        {
          key: '2',
          label: (<> {
            <>
              <Icon icon="ant-design:delete-outlined" />
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                <a>Delete Diesel Entry</a>
              </Popconfirm>
            </>
          }
          </>
  
          ),
        }
      ];
    }

  const fetchFuelData = async (date) => {
    setModalData(false)
    const year = moment(date).format('YYYY');
    const month = moment(date).endOf('month').format('MM');


    // const queryString = `from_date=${startOfMonth}&to_date=${endOfMonth}`
    const queryString = `${userId}/${year}/${month}`

    setModalOpener(true);
    setFuelDataLoading(true);
    const fuelData = await fetchFuelConsumptionInfo(queryString);
    
    if (fuelData && fuelData.fullfilled) {
      const newDattta = fuelData.data.map((elementData) => {
        return {
          fuel_consumption_id: elementData.fuel_consumption_id,
          date: elementData.date,
          quantity: elementData.quantity,
          hours_of_use: elementData.hours_of_use,
          // ...(elementData.data.energy_consumed['Gen 1'] ? { energy_consumed_gen_1: elementData.data.energy_consumed['Gen 1'] } : { energy_consumed_gen_1: 0 }),
          ...(!isNaN(elementData.energy_consumed['Gen 1']) ? { energy_consumed_gen_1: elementData.energy_consumed['Gen 1'] } : {}),
          ...(!isNaN(elementData.energy_consumed['Gen 2']) ? { energy_consumed_gen_2: elementData.energy_consumed['Gen 2'] } : {}),
          ...(!isNaN(elementData.energy_consumed['Gen 3']) ? { energy_consumed_gen_3: elementData.energy_consumed['Gen 3'] } : {}),
          ...(!isNaN(elementData.energy_per_litre['Gen 1']) ? { energy_per_litre_gen_1: elementData.energy_per_litre['Gen 1'] } : {}),
          ...(!isNaN(elementData.energy_per_litre['Gen 2']) ? { energy_per_litre_gen_2: elementData.energy_per_litre['Gen 2'] } : {}),
          ...(!isNaN(elementData.energy_per_litre['Gen 3']) ? { energy_per_litre_gen_3: elementData.energy_per_litre['Gen 3'] } : {}),
          ...(!isNaN(elementData.litres_per_hour['Gen 1']) ? { litres_per_hour_gen_1: elementData.litres_per_hour['Gen 1'] } : {}),
          ...(!isNaN(elementData.litres_per_hour['Gen 2']) ? { litres_per_hour_gen_2: elementData.litres_per_hour['Gen 2'] } : {}),
          ...(!isNaN(elementData.litres_per_hour['Gen 3']) ? { litres_per_hour_gen_3: elementData.litres_per_hour['Gen 3'] } : {}),
        }
      })
      setModalData(newDattta);
    }
    setFuelDataLoading(false);
  }
  useEffect(() => {
    fetchFuelData()
  }, []);

  const onDailyDieselEntrySubmit = async ({ from_date, to_date, quantity, fuelType, generator_ids, genType }) => {
    if (defaultBranch != null) {

      const branch = sideBarData.branches[0].branch_id
      const startDate = from_date.format('YYYY-MM-DD');
      const endDate = to_date ? to_date.format('YYYY-MM-DD') : from_date.format('YYYY-MM-DD');
      const parameters = {
        quantity,
        start_date: startDate,
        end_date: endDate,
        fuel_type: fuelType,
        generator_ids: [generator_ids],
        consumption_type: "Daily"
      };
      
      const request = await addFuelConsumption(branch, parameters);

      if (request.message.status === 201) {
        openNotificationWithIcon("success", "daily diesel entry");
        return dailyForm.resetFields();
      }else if (request.message.response.status === 400) {
        errorNotificationWithIcon('error', request.message.response.data.error)
        return dailyForm.resetFields();
      } else {
        errorNotificationWithIcon('error', 'Something went wrong, please try again')
        return dailyForm.resetFields();
      }
    }
    else {
      NotAllowedNotification();
    }
  }

  const onMonthDiesEntrySubmit = async ({ date, quantity, fuelType }) => {
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
        return monthlyForm.resetFields();
      }
      errorNotificationWithIcon('error', request.message.error)
      return monthlyForm.resetFields();
    }
    else {
      NotAllowedNotification();
    }
  }


  // run loader if data is loading
  if (!sideBarData.branches) {
    return <Loader />;
  }

  return (
    <>
      {isOperator ?
        <>
          <div className="breadcrumb-and-print-buttons">
            <BreadCrumb routesArray={breadCrumbRoutes} />
          </div>
          <div className="cost-tracker-forms-content-wrapper">
            <h1 className="center-main-heading">Add Diesel Entry</h1>
            <section className="cost-tracker-form-section add-bills-section">
              <Spin spinning={false}>
                <h2 className="form-section-heading add-bills-section__heading">
                  Daily Diesel Entry
                </h2>

                <Form
                  form={dailyForm}
                  name="diesel-purchase"
                  initialValues={{
                    fuelType: 'diesel',
                  }}
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
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[{ required: true, message: 'Please select start date' }]}
                      >
                        <DatePicker
                          placeholder="Select start date"
                          size="large"
                          style={{ width: "100%" }}
                          format="DD-MMM-YYYY"
                          onChange={(date) => {
                            if (date) {
                              // Automatically update "to_date" if it’s empty or before "from_date"
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
                        validateTrigger={['onChange', 'onBlur']}
                      >
                        <DatePicker
                          placeholder="Select end date (optional)"
                          size="large"
                          style={{ width: "100%" }}
                          format="DD-MMM-YYYY"
                          disabledDate={(current) => {
                            const fromDate = dailyForm.getFieldValue("from_date");
                            return fromDate && current && current.isBefore(fromDate, 'day');
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
                        validateTrigger={['onChange', 'onBlur']}
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
          </div>
          <Table
            dataSource={modalData}
            loading={fuelDataLoading}
            rowKey="start_date"
            // columns={fuelconsumptionColum}
            pagination={{
              pageSize: 6,
            }}
          >
            <Column title="Date" dataIndex="date" key="date" />
            <Column title="Quantity(L)" dataIndex="quantity" key="quantity" />
            <Column title="Hours" dataIndex="hours_of_use" key="hours_of_use" />
            <ColumnGroup title="Energy(kWh)">
              {modalData && modalData[0] && !isNaN(modalData[0].energy_consumed_gen_1) && (
                <Column
                  title="Gen1"
                  dataIndex="energy_consumed_gen_1"
                  key="energy_consumed_gen_1"
                />)}
              {modalData && modalData[0] && !isNaN(modalData[0].energy_consumed_gen_2) && (
                <Column
                  title="Gen2"
                  dataIndex="energy_consumed_gen_2"
                  key="energy_consumed_gen_2"
                />)}
              {modalData && modalData[0] && !isNaN(modalData[0].energy_consumed_gen_3) && (
                <Column
                  title="Gen3"
                  dataIndex="energy_consumed_gen_3"
                  key="energy_consumed_gen_3"
                />)}
            </ColumnGroup>
            <ColumnGroup title="Liters/H">
              {modalData && modalData[0] && !isNaN(modalData[0].litres_per_hour_gen_1) && (
                <Column
                  title="Gen1"
                  dataIndex="litres_per_hour_gen_1"
                  key="litres_per_hour_gen_1"
                />)}
              {modalData && modalData[0] && !isNaN(modalData[0].litres_per_hour_gen_2) && (
                <Column
                  title="Gen2"
                  dataIndex="litres_per_hour_gen_2"
                  key="litres_per_hour_gen_2"
                />)}
              {modalData && modalData[0] && !isNaN(modalData[0].litres_per_hour_gen_3) && (
                <Column
                  title="Gen3"
                  dataIndex="litres_per_hour_gen_3"
                  key="litres_per_hour_gen_3"
                />)}
            </ColumnGroup>
            <ColumnGroup title="kWh/L">
              {modalData && modalData[0] && !isNaN(modalData[0].energy_per_litre_gen_1) && (
                <Column
                  title="Gen1"
                  dataIndex="energy_per_litre_gen_1"
                  key="energy_per_litre_gen_1"
                />)}
              {modalData && modalData[0] && !isNaN(modalData[0].energy_per_litre_gen_2) && (
                <Column
                  title="Gen2"
                  dataIndex="energy_per_litre_gen_2"
                  key="energy_per_litre_gen_2"
                />)}
              {modalData && modalData[0] && !isNaN(modalData[0].energy_per_litre_gen_3) && (
                <Column
                  title="Gen3"
                  dataIndex="energy_per_litre_gen_3"
                  key="energy_per_litre_gen_3"
                />)}
            </ColumnGroup>
            {
              isOperator ?
                (
                  <Column
                    title="More"
                    key="more"
                    render={
                      (_, record) => {
                        const items = itemData(record);
                        return (
                          <Dropdown
                            trigger={["click"]}
                            getPopupContainer={(trigger) => trigger.parentElement}
                            placement="topLeft"
                            overlay={
                              <Menu>
                                <Menu.Item onClick={() => { }}>
                                  <Space size={4}>
                                    <EditOutlined />{" "}
                                    <a
                                      target="_blank"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setEditDieselEntryModal(true);
                                        setDieselEntryData(record);
                                      }}
                                      rel="noopener noreferrer"
                                    >Edit Diesel Entry</a>
                                  </Space>
                                </Menu.Item>
                                <Menu.Item onClick={() => { }} type="link">
                                  <Space size={4}>
                                    <Icon icon="ant-design:delete-outlined" />
                                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                                      <a
                                        onClick={(e) => {
                                          e.preventDefault()
                                          setDieselEntryData(record)
                                        }}
                                      >Delete Diesel Entry</a>
                                    </Popconfirm>
                                  </Space>
                                </Menu.Item>
                              </Menu>
                            }
                          >
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                              More <DownOutlined />
                            </a>
                          </Dropdown>
                        );

                      }
                    }
                  />
                )
                : ''
            }
          </Table>
          <div className="cost-tracker-forms-content-wrapper">
            <h1 className="center-main-heading">Add Monthly Diesel Entry</h1>
            <section className="cost-tracker-form-section add-bills-section">
              <Spin spinning={false}>
                <h2 className="form-section-heading add-bills-section__heading">
                  Monthly Diesel Entry
                </h2>
                <Form
                  form={monthlyForm}
                  name="diesel-purchase"
                  initialValues={{
                    fuelType: 'diesel',
                  }}
                  className="cost-tracker-form"
                  onFinish={onMonthDiesEntrySubmit}
                >
                  <div className="cost-tracker-form-inputs-wrapper">

                    <div className="cost-tracker-input-container">
                      {/* <Form.Item>
                    <DateFieldSecond data={data.purchaseDate} />
                  </Form.Item> */}
                      <Form.Item
                        label={'Date'}
                        name={'date'}
                        labelCol={{ span: 24 }}
                        hasFeedback
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please select date' }
                        ]}
                      >
                        <RangePicker
                          placeholder={data.placeholder}
                          size='large'
                          style={{
                            height: "auto",
                            width: "100%",
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className="cost-tracker-input-container">
                      <Form.Item>
                        <NumberField
                          data={
                            data.quantity
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="cost-tracker-input-container">
                      <Form.Item>
                        <SelectField
                          data={data.fuelType}
                        />
                      </Form.Item>
                    </div>
                    {/* <div className="cost-tracker-input-container">
                  <Form.Item>
                    <SelectGenerator
                      data={data.genType}
                    />
                  </Form.Item>
                </div> */}

                  </div>
                  <button className="generic-submit-button cost-tracker-form-submit-button">
                    Submit
                  </button>
                </Form>
              </Spin>
            </section>
          </div>
        </>
        :
        <UnAuthorizeResponse />
      }
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
  fetchFuelConsumptionData
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDieselEntry);