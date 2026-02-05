import { useEffect, useContext, useState } from 'react';
import { notification, Form, Spin } from 'antd';
import moment from 'moment'

import CompleteDataContext from '../Context';

import { DateField, NumberField, SelectField } from '../components/FormFields/GeneralFormFields';
import { SubmitButton } from '../components/FormFields/CostTrackerFields';
import { updateFuelPurchaseData } from '../redux/actions/constTracker/costTracker.action';
import { connect } from 'react-redux';


const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Updated',
    description: `Your update to the ${formName} has been successfully submitted`,
  });
};


function UpdateDieselPurchase({ match, dieselPurchaseData, updateFuelPurchaseData: editDieselPayment }) {
  const [dieslePurchaseForm] = Form.useForm();
  const [purchaseLoading] = useState(false);

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
      name: 'price_per_litre',
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
  }, [match, setCurrentUrl]);


  let defaultBranch;
  if (organization.branches) {
    defaultBranch = organization.branches[0].branch_id
  }

  useEffect(() => {
    dieslePurchaseForm.setFieldsValue({
        quantity: dieselPurchaseData.quantity,
        price_per_litre: dieselPurchaseData.price_per_litre,
        date: moment(dieselPurchaseData.date)
    })
  }, [dieselPurchaseData])

  // const onAmountOrValueChange = (event) => {
  //   const { amount, value } = prePaidForm.getFieldsValue(true);
  //   let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
  //   newTariff = isFinite(newTariff) ? newTariff : 0;
  //   prePaidForm.setFieldsValue({ tariff: newTariff })
  // }
  // const onPostpaidAmountOrValueChange = (event) => {
  //   const { amount, value } = postPaidForm.getFieldsValue(true);
  //   let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
  //   newTariff = isFinite(newTariff) ? newTariff : 0;
  //   postPaidForm.setFieldsValue({ tariff: newTariff })
  // }

  const onPurchaseTrackerSubmit = async ({quantity, price_per_litre, date, fuelType}) => {
    const id = dieselPurchaseData.id
    const parameters = {
      branch: defaultBranch,
      id,
      quantity,
      price_per_litre,
      date: date.format('YYYY-MM-DD'),
      fuelType
    }

    const request = await editDieselPayment(userId, parameters);
      if (request.fullfilled) {
        openNotificationWithIcon('success', 'fuel purchase tracker');
        return dieslePurchaseForm.resetFields();
      }

      openNotificationWithIcon('error', request.message|| 'An error occured,Please try again!!!')
      return dieslePurchaseForm.resetFields();
  };

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

  // const onUtilityPaymentTrackerPreSubmit = ({
  //   amount,
  //   date,
  //   tariff,
  //   value,
  // }) => {
  //   if (defaultBranch != null) {
  //     setPrePaidLoading(true);
  //     const prePaidData = {
  //       branch: defaultBranch,
  //       value,
  //       amount,
  //       tariff,
  //       date: date.format('YYYY-MM-DD')
  //     }
  //     billingHttpServices
  //       .addCostPrePaid(prePaidData, token, userId)
  //       .then(() => {
  //         setPrePaidLoading(false);
  //         prePaidForm.resetFields()
  //         openNotificationWithIcon('success', 'pre-paid utility payment tracker');
  //       })
  //       .catch(err => {
  //         setPrePaidLoading(false);
  //         console.log(err.response)
  //         alert(err.response, 'Please try again!!!')
  //       })
  //   }
  //   else {
  //     NotAllowedNotification();
  //   }
  // };

  // const onUtilityPaymentTrackerPostSubmit = ({
  //   amount,
  //   date,
  //   tariff,
  //   value,
  // }) => {

  //   const convertDate = (dateObjects) => {
  //     let formatObject = dateObjects.map((eachDateObject) => {
  //       return eachDateObject.format('YYYY-MM-DD')
  //     })
  //     return formatObject
  //   }

  //   let FormattedDate = convertDate(date);

  //   if (defaultBranch != null) {
  //     setPostPaidLoading(true);
  //     const postPaidData = {
  //       branch: defaultBranch,
  //       value,
  //       amount,
  //       tariff,
  //       date: FormattedDate[0],
  //       end_date: FormattedDate[1]
  //     }

  //     billingHttpServices
  //       .addCostPostPaid(postPaidData, token, userId)
  //       .then(() => {
  //         setPostPaidLoading(false);
  //         // reset the form fields
  //         postPaidForm.resetFields();
  //         openNotificationWithIcon('success', 'post-paid utility payment tracker');
  //       })
  //       .catch(error => {
  //         setPostPaidLoading(false);
  //         openNotificationWithIcon('error', 'An error occured,Please try again!!!')
  //       })
  //   }
  //   else {
  //     NotAllowedNotification();
  //   }
  // };

  return (
    <>
      <div className="cost-tracker-forms-content-wrapper">

          <h1 className="center-main-heading">Update Diesel Bills</h1>

          <section className="cost-tracker-form-section add-bills-section">
          <Spin spinning={purchaseLoading}>
            <h2 className="form-section-heading add-bills-section__heading">
               Edit Diesel Purchase Tracker
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

         

      </div>
    </>
  );
}

const mapDispatchToProps = {
  updateFuelPurchaseData
}

export default connect(null, mapDispatchToProps)(UpdateDieselPurchase);