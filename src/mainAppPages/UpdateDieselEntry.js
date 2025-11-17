import React, { useEffect, useContext } from 'react';
import { notification, Form, Spin, DatePicker, Select } from 'antd';
import { connect } from 'react-redux';
import CompleteDataContext from '../Context';
import moment from 'moment'

import { updateFuelConsumptionData } from '../redux/actions/constTracker/costTracker.action';
import { DateField, NumberField, SelectField } from '../components/FormFields/GeneralFormFields';
import { Option } from 'antd/lib/mentions';

const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Updated',
    description: `Your update to the ${formName} has been successfully submitted`,
  });
};

const errorNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Something went wrong',
    description: `Your update to the ${formName} can not be completed at the moment, please try again`,
  });
};

const NotAllowedNotification = () => {
  notification.error({
    message: 'Request Error',
    description: 'NOT ALLOWED',
    duration: 5
  })
}

function UpdateDieselEntry({ match, dieselEntryData, updateFuelConsumptionData:editFuelConsumption, holdBranchGenerators }) {
  const [dailyForm] = Form.useForm();
  console.log('DieselEntryData === ', dieselEntryData);
  

  const { setCurrentUrl, organization, userId } = useContext(
    CompleteDataContext
    );

  const entryId = dieselEntryData.fuel_consumption_id


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
    }
  }

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, userId]);

  useEffect(() => {
    if (dieselEntryData) {
      dailyForm.setFieldsValue({
        quantity: dieselEntryData.quantity,
        start_date: moment(dieselEntryData.start_date),
        end_date: moment(dieselEntryData.end_date),
        fuelType: dieselEntryData.fuelType,
        generator_name: dieselEntryData.generator_name,
        fuel_consumption_id: dieselEntryData.fuel_consumption_id
      })
    }
  }, [dieselEntryData])


  let defaultBranch;
  if (organization.branches) {
    defaultBranch = organization.branches[0].branch_id
  }

  let generatorList
  if (holdBranchGenerators) {
    generatorList = holdBranchGenerators.flat()
  }

  const onUsedTrackerSubmit = async ({ from_date, to_date, quantity, fuelType, generator_ids }) => {
    if (defaultBranch != null) {
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
      const request = await editFuelConsumption(entryId, parameters);

      if (request.fullfilled) {
        openNotificationWithIcon('success', 'diesel entry');
        return dailyForm.resetFields();
      }

      errorNotificationWithIcon('error', 'diesel entry')
      return dailyForm.resetFields();
    }
    else {
      NotAllowedNotification();
    }
  }

  return (
    <>
      <div className="cost-tracker-forms-content-wrapper">
        <h1 className="center-main-heading">Update Diesel Entry</h1>
        <section className="cost-tracker-form-section add-bills-section">
          <Spin spinning={false}>
            <h2 className="form-section-heading add-bills-section__heading">
              Diesel Entry
            </h2>
            <Form
              form={dailyForm}
              name="diesel-purchase"
              initialValues={{ fuelType: "diesel" }}
              className="cost-tracker-form"
              onFinish={onUsedTrackerSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">
                {/* FROM DATE */}
                <div className="cost-tracker-input-container">
                  <Form.Item
                    label="From Date"
                    name="start_date"
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
                    name="end_date"
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
                {/* <div className="cost-tracker-input-container">
                  <Form.Item>
                    <SelectField data={data.fuelType} />
                  </Form.Item>
                </div> */}
                {/* GENERATOR */}
                <div className="cost-tracker-input-container">
                  <Form.Item
                    name="generator_name"
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
      </div>
    </>
  );
}

const mapDispatchToProps = {
  updateFuelConsumptionData,
};

export default connect(null, mapDispatchToProps)(UpdateDieselEntry);