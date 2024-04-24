import React, { useEffect, useContext } from 'react';
import { notification, Form, Spin, message } from 'antd';

import CompleteDataContext from '../Context';

import billingHttpServices from '../services/bills'
import axios from 'axios'


import BreadCrumb from '../components/BreadCrumb';
import Loader from '../components/Loader';
import { DateField, DateRangeField, NumberField, SelectField } from '../components/FormFields/GeneralFormFields';
import { InputField, SubmitButton, FlowMeterUpload } from '../components/FormFields/CostTrackerFields';
import EnvData from '../config/EnvData';


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/cost-tracker', name: 'Cost Tracker', id: 2 },
  { url: '#', name: 'Add Bills', id: 3 },
];

const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Updated',
    description: `Your addition to the ${formName} has been successfully submitted`,
  });
};

const NotAllowedNotification = () => {
  notification.error({
    message: 'Request Error',
    description: 'NOT ALLOWED',
    duration: 5
  })
}

function AddBills({ match }) {
  const [dieslePurchaseForm] = Form.useForm();
  const [prePaidForm] = Form.useForm();
  const [ippPurchaseForm] = Form.useForm();
  const [postPaidForm] = Form.useForm();
  const [EOMBalanceForm] = Form.useForm();
  const [badFileHeader, setBadFileHeader] = React.useState(false);
  const [purchaseLoading, setPurchaseLoading] = React.useState(false);
  const [prePaidLoading, setPrePaidLoading] = React.useState(false);
  const [ippPurchaseLoading, setIppPurchaseLoading] = React.useState(false);
  const [postPaidLoading, setPostPaidLoading] = React.useState(false);
  const [EOMFlowReadingLoading, setEOMFlowReadingLoading] = React.useState(false);

  const { setCurrentUrl, isAuthenticatedDataLoading, token, organization, userId } = useContext(
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
    ippPurchaseDate: {
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
      label: 'Amount(₦)',
      name: 'amount',
      placeholder: 'Enter Amount(₦)'
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

  const onIppAmountOrValueChange = (event) => {
    const { amount, value } = ippPurchaseForm.getFieldsValue(true);
    let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
    newTariff = isFinite(newTariff) ? newTariff : 0;
    ippPurchaseForm.setFieldsValue({ tariff: newTariff })
  }

  const onPostpaidAmountOrValueChange = (event) => {
    const { amount, value } = postPaidForm.getFieldsValue(true);
    let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
    newTariff = isFinite(newTariff) ? newTariff : 0;
    postPaidForm.setFieldsValue({ tariff: newTariff })
  }

  const onPurchaseTrackerSubmit = ({
    quantity,
    pricePerLitre,
    date,
    fuelType,
  }) => {

    const DieselCostData = {
      branch: defaultBranch,
      quantity,
      price_per_litre: pricePerLitre,
      date: date.format('YYYY-MM-DD')
    }
    setPurchaseLoading(true);

    billingHttpServices
      .addCostForDiesel(DieselCostData, token, userId, fuelType)
      .then(() => {
        openNotificationWithIcon('success', 'fuel purchase tracker');
        dieslePurchaseForm.resetFields();
        setPurchaseLoading(false);
      })
      .catch((err) => {
        console.log(err)
        setPurchaseLoading(false);
        message('An error occured, Please try again!!')
      })
  };

  const onUsedTrackerSubmit = ({ date, balance, flowMeterUpload }) => {
    if (defaultBranch != null) {
      setEOMFlowReadingLoading(true);
      let formData = new FormData()
      formData.append('branch', defaultBranch)
      formData.append('quantity', balance)
      formData.append('date', date.format('YYYY-MM-DD'))
      formData.append('image', flowMeterUpload[0])

      axios.post(`${EnvData.REACT_APP_API_URL}add_month_end_cost/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `bearer ${token}`,
        }
      }).then(res => {
        setEOMFlowReadingLoading(false);
        openNotificationWithIcon('success', 'Form submitted successfully');
        EOMBalanceForm.resetFields()
      }).catch(e => {
        setEOMFlowReadingLoading(false);
        openNotificationWithIcon('error', 'An error occured,Please try again!!!')
        EOMBalanceForm.resetFields()
      })
    }
    else {
      NotAllowedNotification();
    }
  }

  const onUtilityPaymentTrackerPreSubmit = ({
    amount,
    date,
    tariff,
    value,
  }) => {
    if (defaultBranch != null) {
      setPrePaidLoading(true);
      const prePaidData = {
        branch: defaultBranch,
        value,
        amount,
        tariff,
        date: date.format('YYYY-MM-DD')
      }
      billingHttpServices
        .addCostPrePaid(prePaidData, token, userId)
        .then(() => {
          setPrePaidLoading(false);
          prePaidForm.resetFields()
          openNotificationWithIcon('success', 'pre-paid utility payment tracker');
        })
        .catch(err => {
          setPrePaidLoading(false);
          console.log(err.response)
          alert(err.response, 'Please try again!!!')
        })
    }
    else {
      NotAllowedNotification();
    }
  };

  const onIppPaymentTrackerSubmit = ({
    amount,
    date,
    tariff,
    value,
  }) => {
    if (defaultBranch != null) {
      setIppPurchaseLoading(true);
      const ippData = {
        branch: defaultBranch,
        value,
        amount,
        tariff,
        date: date.format('YYYY-MM-DD')
      }
      billingHttpServices
        .addCostIpp(ippData, token, userId)
        .then(() => {
          setIppPurchaseLoading(false);
          ippPurchaseForm.resetFields()
          openNotificationWithIcon('success', 'IPP payment tracker');
        })
        .catch(err => {
          setIppPurchaseLoading(false);
          console.log(err.response)
          alert(err.response, 'Please try again!!!')
        })
    }
    else {
      NotAllowedNotification();
    }
  };

  const onUtilityPaymentTrackerPostSubmit = ({
    amount,
    date,
    tariff,
    value,
  }) => {

    const convertDate = (dateObjects) => {
      let formatObject = dateObjects.map((eachDateObject) => {
        return eachDateObject.format('YYYY-MM-DD')
      })
      return formatObject
    }

    let FormattedDate = convertDate(date);

    if (defaultBranch != null) {
      setPostPaidLoading(true);
      const postPaidData = {
        branch: defaultBranch,
        value,
        amount,
        tariff,
        date: FormattedDate[0],
        end_date: FormattedDate[1]
      }

      billingHttpServices
        .addCostPostPaid(postPaidData, token, userId)
        .then(() => {
          setPostPaidLoading(false);
          // reset the form fields
          postPaidForm.resetFields();
          openNotificationWithIcon('success', 'post-paid utility payment tracker');
        })
        .catch(error => {
          setPostPaidLoading(false);
          openNotificationWithIcon('error', 'An error occured,Please try again!!!')
        })
    }
    else {
      NotAllowedNotification();
    }
  };

  // run loader if data is loading
  if (isAuthenticatedDataLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className="cost-tracker-forms-content-wrapper">

          <h1 className="center-main-heading">Add Bills</h1>

          <section className="cost-tracker-form-section add-bills-section">
          <Spin spinning={purchaseLoading}>
            <h2 className="form-section-heading add-bills-section__heading">
              Diesel Purchase Tracker
            </h2>
            <Form
              form={dieslePurchaseForm}
              name="diesel-purchase"
              className="cost-tracker-form"
              initialValues={{
                fuelType: 'diesel',
              }}
              onFinish={onPurchaseTrackerSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">
                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      data.quantity
                    }
                  />
                </div>
                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      data.pricePerLitter
                    }
                  />
                </div>
                <div className="cost-tracker-input-container">
                  <DateField data={data.purchaseDate} />
                </div>
                <div className="cost-tracker-input-container">
                  <SelectField
                    data={data.fuelType}
                  />
                </div>
              </div>
              <SubmitButton />
            </Form>
            </Spin>
          </section>

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
          <Spin spinning={ippPurchaseLoading}>
            <h2 className="form-section-heading">
              IPP Payment Tracker
            </h2>

            <Form
              form={ippPurchaseForm}
              name="diesel-purchase"
              className="cost-tracker-form"
              onFinish={onIppPaymentTrackerSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">
                <div className="cost-tracker-input-container">
                  <NumberField
                    data={
                      {
                        ...data.amount,
                        onDataChange: onIppAmountOrValueChange
                      }
                    }
                  />
                </div>

                <div className="cost-tracker-input-container">
                  <DateField data={data.ippPurchaseDate} />
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
                        onDataChange: onIppAmountOrValueChange
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

          {/* <section className="cost-tracker-form-section add-bills-section">
          <Spin spinning={EOMFlowReadingLoading}>
            <h2 className="form-section-heading add-bills-section__heading">
              End of Month Diesel flow meter reading
            </h2>

            <Form
              form={EOMBalanceForm}
              name="diesel-purchase"
              className="cost-tracker-form"
              onFinish={onUsedTrackerSubmit}
            >
              <div className="cost-tracker-form-inputs-wrapper">

                <div className="cost-tracker-input-container">
                  <DateField data={data.purchaseDate} />
                </div>
                <div className="cost-tracker-input-container">
                  <InputField data={data.balance} />
                </div>

                <div className="cost-tracker-input-container" >
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
          </section> */}

      </div>
    </>
  );
}

export default AddBills;
