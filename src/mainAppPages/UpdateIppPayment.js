import { useEffect, useContext } from 'react';
import { notification, Form, Spin } from 'antd';

import CompleteDataContext from '../Context';
import moment from 'moment'

import { connect } from 'react-redux';

import { DateField, NumberField } from '../components/FormFields/GeneralFormFields';
import { SubmitButton } from '../components/FormFields/CostTrackerFields';
import { updateIppPaymentData } from '../redux/actions/constTracker/costTracker.action';


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

function UpdateIppPayment({ match, ippPurchaseData, updateIppPaymentData:editIppPayment }) {
  const [ippForm] = Form.useForm();

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
  }, [match, userId, setCurrentUrl]);

  useEffect(() => {
    ippForm.setFieldsValue({
      amount: ippPurchaseData.amount,
      date: moment(ippPurchaseData.date),
      tariff: ippPurchaseData.tariff,
      value: ippPurchaseData.value
    })
  }, [ippPurchaseData, ippForm])

  let defaultBranch;
  if (organization.branches) {
    defaultBranch = organization.branches[0].branch_id
  }

  const onIppAmountOrValueChange = (event) => {
    const { amount, value } = ippForm.getFieldsValue(true);
    let newTariff = Number(amount / value || 0)?.toFixed(2) || 0;
    newTariff = isFinite(newTariff) ? newTariff : 0;
    ippForm.setFieldsValue({ tariff: newTariff })
  }

  const onIppPaymentTrackerSubmit = async ({amount, date, tariff, value}) => {
    const id = ippPurchaseData.id
    if (defaultBranch != null) {
      const ippParameters = {
        branch: defaultBranch,
        id,
        value,
        amount,
        tariff,
        date: date.format('YYYY-MM-DD')
      }
      const request = await editIppPayment(userId, ippParameters)
        if(request.fullfilled) { 
          openNotificationWithIcon('success', 'IPP payment tracker');
          return ippForm.resetFields()
        }
          openNotificationWithIcon('failed', 'something went wrong')
          return ippForm.resetFields()
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
          <Spin>
            <h2 className="form-section-heading">
              IPP Payment Tracker 
            </h2>

            <Form
              form={ippForm}
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
      </div>
    </>
  );
}

const mapDispatchToProps = {
    updateIppPaymentData
}

export default connect(null, mapDispatchToProps)(UpdateIppPayment);
