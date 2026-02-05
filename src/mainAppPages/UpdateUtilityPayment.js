import { useEffect, useContext, useState } from 'react';
import { notification, Form, Spin } from 'antd';

import CompleteDataContext from '../Context';
import moment from 'moment'

import { connect } from 'react-redux';


import { DateField, DateRangeField, NumberField } from '../components/FormFields/GeneralFormFields';
import { InputField, SubmitButton, FlowMeterUpload } from '../components/FormFields/CostTrackerFields';
import { updatePostpaidUtilityPaymentData, updatePrepaidUtilityPaymentData } from '../redux/actions/constTracker/costTracker.action';


const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Updated',
    description: `Your update to the ${formName} has been successfully submitted`,
  });
};

const NotAllowedNotification = () => {
  notification.error({
    message: 'Request Error',
    description: 'NOT ALLOWED',
    duration: 5
  })
}

function UpdateUtilityPayment({ match, utilityPurchaseData, updatePrepaidUtilityPaymentData:updatePrepaidPayment, updatePostpaidUtilityPaymentData:updatePostpaidPayment }) {

  const [prePaidForm] = Form.useForm();
  const [postPaidForm] = Form.useForm();
  const [EOMBalanceForm] = Form.useForm();
  const [badFileHeader, setBadFileHeader] = useState(false);
  const [prePaidLoading] = useState(false);
  const [postPaidLoading] = useState(false);
  const [EOMFlowReadingLoading] = useState(false);

  const { setCurrentUrl, organization, userId } = useContext(
    CompleteDataContext
  );

  const data = {
    quantity: {
      label: 'Quantity',
      name: 'quantity',
      placeholder: 'Enter Quantity'
    },
    pricePerLitter: {
      label: 'Price(₦)/Litre',
      name: 'pricePerLitre',
      placeholder: 'Enter Price(₦)/Litre'
    },
    purchaseDate: {
      label: 'Date',
      name: 'date'
    },
    utitliyPurchaseDate: {
      label: 'Date of Purchase',
      name: 'date'
    },
    fuelType: {
      name: 'fuelType',
      label: 'Fuel Type',
      optionData: ['diesel'],
      placeholder: 'Select Fuel Type'
    },
    amount: {
      label: 'Amount',
      name: 'amount',
      placeholder: 'Enter Amount'
    },
    value: {
      label: 'Value (kWh)',
      name: 'value',
      placeholder: 'Enter value'
    },
    tariff: {
      label: 'Tariff (vat inclusive))',
      name: 'tariff',
      placeholder: 'Calculated tariff'
    },
    periodCovered: {
      label: 'Period Covered',
      name: 'date'
    },
    balance: {
      label: 'Flow meter reading',
      name: 'balance',
      placeholder: 'Enter meter reading'
    },
  }

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, userId]);

  useEffect(() => {
    prePaidForm.setFieldsValue({
      amount: utilityPurchaseData.amount,
      date: moment(utilityPurchaseData.date),
      tariff: utilityPurchaseData.tariff,
      value: utilityPurchaseData.value
    })
  }, [])

  useEffect(() => {
    postPaidForm.setFieldsValue({
      amount: utilityPurchaseData.amount,
      date: moment(utilityPurchaseData.date),
      end_date: moment(utilityPurchaseData.date),
      tariff: utilityPurchaseData.tariff,
      value: utilityPurchaseData.value
    })
  }, [])


  let defaultBranch;
  if (organization.branches) {
    defaultBranch = organization.branches[0].branch_id
  }

  const onAmountOrValueChange = (event) => {
    const { amount, value } = prePaidForm.getFieldsValue(true);
    let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
    newTariff = isFinite(newTariff) ? newTariff : 0;
    prePaidForm.setFieldsValue({ tariff: newTariff })
  }
  const onPostpaidAmountOrValueChange = (event) => {
    const { amount, value } = postPaidForm.getFieldsValue(true);
    let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
    newTariff = isFinite(newTariff) ? newTariff : 0;
    postPaidForm.setFieldsValue({ tariff: newTariff })
  }


  // const onUsedTrackerSubmit = ({ date, balance, flowMeterUpload }) => {
  //   if (defaultBranch != null) {
  //     setEOMFlowReadingLoading(true);
  //     let formData = new FormData()
  //     formData.append('branch', defaultBranch)
  //     formData.append('quantity', balance)
  //     formData.append('date', date.format('YYYY-MM-DD'))
  //     formData.append('image', flowMeterUpload[0])

  //     axios.post(`${EnvData.REACT_APP_API_URL}add_month_end_cost/${userId}/`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `bearer ${token}`,
  //       }
  //     }).then(res => {
  //       setEOMFlowReadingLoading(false);
  //       openNotificationWithIcon('success', 'Form submitted successfully');
  //       EOMBalanceForm.resetFields()
  //     }).catch(e => {
  //       setEOMFlowReadingLoading(false);
  //       openNotificationWithIcon('error', 'An error occured,Please try again!!!')
  //       EOMBalanceForm.resetFields()
  //     })
  //   }
  //   else {
  //     NotAllowedNotification();
  //   }
  // }

  const onUtilityPaymentTrackerPreSubmit = async ({amount, date, tariff, value}) => {
    const id = utilityPurchaseData.id
    if (defaultBranch != null) {
      const parameterPrepaid = {
        branch: defaultBranch,
        id,
        value,
        amount,
        tariff,
        date: date.format('YYYY-MM-DD')
      }
      const request = await updatePrepaidPayment(userId, parameterPrepaid)
        if(request.fullfilled) { 
          openNotificationWithIcon('success', 'pre-paid utility payment tracker');
          return prePaidForm.resetFields()
        }
          openNotificationWithIcon('failed', 'something went wrong')
          return prePaidForm.resetFields()
    }
    else {
      NotAllowedNotification();
    }
  };

  const onUtilityPaymentTrackerPostSubmit = async ({amount, date, tariff, value}) => {
    const convertDate = (dateObjects) => {
      let formatObject = dateObjects.map((eachDateObject) => {
        return eachDateObject.format('YYYY-MM-DD')
      })
      return formatObject
    }

    let FormattedDate = convertDate(date);
    const id = utilityPurchaseData.id
    if (defaultBranch != null) {
      const parameterPostpaid = {
        branch: defaultBranch,
        id,
        value,
        amount,
        tariff,
        date: FormattedDate[0],
        end_date: FormattedDate[1]
      }

      const request = await updatePostpaidPayment(userId, parameterPostpaid)
      if (request.fullfilled) {
        openNotificationWithIcon('success', 'post-paid utility payment tracker');
        return postPaidForm.resetFields();
      }       
        openNotificationWithIcon('error', 'An error occured,Please try again!!!')
        return postPaidForm.resetFields();
    }
    else {
      NotAllowedNotification();
    }
  };

  return (
    <>
      <div className="cost-tracker-forms-content-wrapper">

          <h1 className="center-main-heading">Edit Payment Bills</h1>
          <section className="cost-tracker-form-section">
          <Spin spinning={prePaidLoading}>
            <h2 className="form-section-heading">
              Utility Payment Tracker (Pre-paid)
            </h2>

            <Form
              form={prePaidForm}
              name="diesel-purchase"
              className="cost-tracker-form"
              onFinish={onUtilityPaymentTrackerPreSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">
                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      {
                        ...data.amount,
                        onDataChange: onAmountOrValueChange
                      }
                    }
                  />
                </div>

                <div className="cost-tracker-input-container">
                  <DateField data={data.utitliyPurchaseDate} />
                </div>

                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      data.tariff
                    }
                    disabled={true}
                    required={false}
                  />
                </div>

                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      {
                        ...data.value,
                        onDataChange: onAmountOrValueChange
                      }
                    }
                  />
                </div>
              </div>

              <SubmitButton />
            </Form>
            </Spin>
          </section>

          <section className="cost-tracker-form-section">
          <Spin spinning={postPaidLoading}>
            <h2 className="form-section-heading">
              Utility Payment Tracker (Post-paid)
            </h2>

            <Form
              form={postPaidForm}
              name="diesel-purchase"
              className="cost-tracker-form"
              onFinish={onUtilityPaymentTrackerPostSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">

                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      {
                        ...data.amount,
                        onDataChange: onPostpaidAmountOrValueChange
                      }
                    }
                  />
                </div>

                <div className="cost-tracker-input-container">
                  <DateRangeField data={data.periodCovered} />
                </div>

                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      data.tariff
                    }
                    required={false}
                    disabled={true}
                  />
                </div>

                <div className="cost-tracker-input-container">
                  <NumberField
                    data=
                    {
                      {
                        ...data.value,
                        onDataChange: onPostpaidAmountOrValueChange
                      }
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="generic-submit-button cost-tracker-form-submit-button"
              >
                Submit
              </button>
            </Form>
            </Spin>
          </section>

          <section className="cost-tracker-form-section add-bills-section">
          <Spin spinning={EOMFlowReadingLoading}>
            <h2 className="form-section-heading add-bills-section__heading">
              End of Month Diesel flow meter reading
            </h2>

            <Form
              form={EOMBalanceForm}
              name="diesel-purchase"
              className="cost-tracker-form"
              // onFinish={onUsedTrackerSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">

                <div className="cost-tracker-input-container">
                  <DateField data={data.purchaseDate} />
                </div>
                <div className="cost-tracker-input-container">
                  <InputField data={data.balance} />
                </div>

                <div className="cost-tracker-input-container" >
                  {/* <label
                  className="generic-input-label cost-tracker-input-label"
                  htmlFor="flow-meter-snapshot"
                >
                  Flow Meter Snapshot
                </label>
                <input
                  style={{ backgroundColor: '#C4C4C48A' }}
                  className="generic-input"
                  type="file"
                  accept="image/png, image/jpeg"
                  name="flowMeterSnapshot"
                  onChange={(e) => {
                    setImages(e.target.files[0])
                  }}
                  id="flow-meter-snapshot"
                  ref={registerUsedTracker({
                    required: true,
                  })}
                  required
                  autoFocus
                /> */}
                  <FlowMeterUpload
                    badFileHeader={badFileHeader}
                    setBadFileHeader={setBadFileHeader}
                    inputSize='large'
                  />
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
  updatePrepaidUtilityPaymentData,
  updatePostpaidUtilityPaymentData
}

export default connect(null, mapDispatchToProps)(UpdateUtilityPayment);
