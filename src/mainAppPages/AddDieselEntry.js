import React, { useEffect, useContext, useState } from 'react';
import { notification, Form, Spin, DatePicker, Select } from 'antd';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import CompleteDataContext from '../Context';

import moment from 'moment';

import BreadCrumb from '../components/BreadCrumb';
import Loader from '../components/Loader';
import { addFuelConsumptionData, addMonthlyFuelConsumptionData, getBranchGeneratorsData } from '../redux/actions/constTracker/costTracker.action';
import { DateField, NumberField, SelectField, SelectGenerator } from '../components/FormFields/GeneralFormFields';
import { Option } from 'antd/lib/mentions';
import UnAuthorizeResponse from './UnAuthorizeResponse';


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

function AddDieselEntry({ match, costTracker, addFuelConsumptionData: addFuelConsumption, addMonthlyFuelConsumptionData: addMonthlyConsumption, getBranchGeneratorsData }) {
  const [dailyForm] = Form.useForm();
  const [monthlyForm] = Form.useForm();
  const [holdBranchGenerators, setHoldBranchGenerators] = useState([]);

  const { setCurrentUrl, userId, userData } = useContext(
    CompleteDataContext
  );

  const isOperator = userData.role_text === "OPERATOR";

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

  const onDailyDieselEntrySubmit = async ({ date, quantity, fuelType, generator_ids, genType }) => {
    if (defaultBranch != null) {

      const branch = sideBarData.branches[0].branch_id
      const parameters = {
        quantity: quantity,
        start_date: date.format('YYYY-MM-DD'),
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
                    <div className="cost-tracker-input-container">
                      <Form.Item>
                        <DateField data={data.purchaseDate} />
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
                    <div className="cost-tracker-input-container">
                      <Form.Item
                        name="generator_ids"
                        label="Generator"
                        labelCol={{ span: 24 }}
                        hasFeedback
                        validateTrigger={['onChange', 'onBlur']}
                      // rules={[
                      //   ...(require ? [{ required: true, message: 'Please select generator' }] : []),
                      // ]}
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
  addMonthlyFuelConsumptionData
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDieselEntry);