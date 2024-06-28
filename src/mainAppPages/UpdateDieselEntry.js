import React, { useEffect, useContext } from 'react';
import { notification, Form, Spin } from 'antd';
import { connect } from 'react-redux';
import CompleteDataContext from '../Context';
import moment from 'moment'

import { updateFuelConsumptionData } from '../redux/actions/constTracker/costTracker.action';
import { DateField, NumberField, SelectField } from '../components/FormFields/GeneralFormFields';

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

function UpdateDieselEntry({ match, dieselEntryData, updateFuelConsumptionData:editFuelConsumption }) {
  const [EOMBalanceForm] = Form.useForm();

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
    EOMBalanceForm.setFieldsValue({
      quantity: dieselEntryData.quantity,
      date: moment(dieselEntryData.date),
      fuelType: dieselEntryData.fuelType
    })
  }, [EOMBalanceForm])


  let defaultBranch;
  if (organization.branches) {
    defaultBranch = organization.branches[0].branch_id
  }


  const onUsedTrackerSubmit = async ({ date, quantity, fuelType }) => {
    if (defaultBranch != null) {

      const parameters = {
        end_date: date.format('YYYY-MM-DD'),
        start_date: date.format('YYYY-MM-DD'),
        fuel_type: fuelType,
        quantity: quantity,
      };
      const request = await editFuelConsumption(entryId, parameters);

      if (request.fullfilled) {
        openNotificationWithIcon('success', 'diesel entry');
        return EOMBalanceForm.resetFields();
      }

      errorNotificationWithIcon('error', 'diesel entry')
      return EOMBalanceForm.resetFields();
    }
    else {
      NotAllowedNotification();
    }
  }

  return (
    <>
      {/* <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div> */}

      <div className="cost-tracker-forms-content-wrapper">

        <h1 className="center-main-heading">Update Diesel Entry</h1>

        <section className="cost-tracker-form-section add-bills-section">
          <Spin spinning={false}>
            <h2 className="form-section-heading add-bills-section__heading">
              Diesel Entry
            </h2>

            <Form
              form={EOMBalanceForm}
              name="diesel-purchase"
              initialValues={{
                fuelType: 'diesel',
              }}
              className="cost-tracker-form"
              onFinish={onUsedTrackerSubmit}
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

// export default AddDieselEntry;


const mapDispatchToProps = {
  updateFuelConsumptionData,
};


export default connect(null, mapDispatchToProps)(UpdateDieselEntry);