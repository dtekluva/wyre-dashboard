import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, notification, Select } from 'antd';
import CompleteDataContext from '../Context';

import equipmentHttpServices from '../services/equipment';

import BreadCrumb from '../components/BreadCrumb';
import ListOfEquipmentTable from '../components/tables/ListOfEquipmentTable';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/cost-tracker', name: 'Cost Tracker', id: 2 },
  { url: '#', name: 'Add Equipment', id: 3 },
];

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Submission Successful',
    description: `Equipment list successfully updated`,
  });
};

function AddEquipment({ match }) {
  const { setCurrentUrl, token, userId, organization } = useContext(CompleteDataContext);
  const [allEquipment, setAllEquipment] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    errors,
  } = useForm();

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }

    equipmentHttpServices
      .getAll(userId,token)
      .then((returnedEquipment) =>{ 
        setAllEquipment(returnedEquipment.data.data)
      })
      .catch((error) => {
        console.log(error.response);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, setCurrentUrl, token, userId]);

  const { Option } = Select
  let branchname = organization && organization.branches

  const branchSelectorStyle = {
      width:'100%',
      borderRadius: '4px',
      display:'block',
      color: '#595959',
      fontSize: '1.4rem',
      height: '40px',
  }

  let branchSelectorValue;

  if(organization.branches.length === 1){
    organization.branches && organization.branches.map((branch)=>{
      branchSelectorValue = branch.branch_id
      return branch.branch_id
    })
  }
  else{
    branchSelectorValue = null
  }
  const branchSelector = (
        <Select style={branchSelectorStyle} 
        className="h-4-br" 
        allowClear 
        onSelect={(branch)=>{
          branchSelectorValue =  branch
        }}>
        {branchname && branchname.map((branch)=>{
        return <Option value={branch.id} key={branch.id}>
                  {branch.name}
              </Option>
        })
        }
        </Select>
  )

  const equipmentPurchaseDatePicker = (
    <DatePicker
      format="DD-MM-YYYY"
      className="generic-input"
      id="equipment-purchase-date"
      onChange={(e) => setValue('equipmentPurchaseDate', e.target.value, true)}
    />
  );

  
  const NotAllowedNotification = () => {
    notification.error({
      message:'Request Error',
      description:'NOT ALLOWED',
      duration:6
    })
}
  const onSubmit = ({
    equipmentName,
    equipmentWattage,
    equipmentPurchaseDate,
    equipmentQuantity,
  }) => {
    const newEquipmentData = {
      name: equipmentName,
      voltage: equipmentWattage,
      quantity: equipmentQuantity,
      date_purchased: equipmentPurchaseDate.format('YYYY-MM-DD'),
    };

    if(branchSelectorValue != null){
      let submitData = equipmentHttpServices.add(newEquipmentData,branchSelectorValue,userId,token)
      submitData.then((returnedEquipment) => {
            // setAllEquipment(allEquipment.concat(returnedEquipment));
            // console.log(Object.assign({},returnedEquipment))
            openNotificationWithIcon('success');
          })
      submitData.catch((error) => {
          alert('An error occured, please try again.')
            console.log(error.response);
          });
    }
    else{
      NotAllowedNotification();
    }
   
    // Reset form fields. Controller value is set manually
    setValue('equipmentPurchaseDate', undefined);
    reset();
  };

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className="cost-tracker-forms-content-wrapper">
        <h1 className="center-main-heading">Equipment</h1>

        <section className="cost-tracker-form-section">
          <h2 className="form-section-heading cost-tracker-form-section__heading">
            Add Equipment
          </h2>

          <form
            className="cost-tracker-form"
            action="#"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="cost-tracker-form-inputs-wrapper">
              <div className="cost-tracker-input-container">
                <label
                  className="generic-input-label cost-tracker-input-label"
                  htmlFor="equipment-name"
                >
                  Equipment Name
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="equipmentName"
                  id="equipment-name"
                  placeholder="Television"
                  ref={register}
                  required
                  autoFocus
                />
              </div>

              <div className="cost-tracker-input-container">
                <label
                  className="generic-input-label cost-tracker-input-label"
                  htmlFor="equipment-wattage"
                >
                  Wattage (watts)
                </label>
                <input
                  className="generic-input"
                  type="text"
                  inputMode="decimal"
                  name="equipmentWattage"
                  id="equipment-wattage"
                  placeholder="200"
                  ref={register({
                    required: true,
                    pattern: /^-?\d+\.?\d*$/,
                  })}
                  required
                />
                <p className="input-error-message">
                  {errors.equipmentWattage && 'Please enter a number'}
                </p>
              </div>

              <div className="cost-tracker-input-container">
                <label
                  className="generic-input-label cost-tracker-input-label"
                  htmlFor="equipment-purchase-date"
                >
                  Date Purchased
                </label>
                <Controller
                  as={equipmentPurchaseDatePicker}
                  name="equipmentPurchaseDate"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  validateStatus={
                    errors.equipmentPurchaseDate && 'Please select a date'
                      ? 'error'
                      : ''
                  }
                  help={errors.equipmentPurchaseDate && 'Please select a date'}
                />
                <p className="input-error-message">
                  {errors.equipmentPurchaseDate && 'Please select a date'}
                </p>
              </div>

              <div className="cost-tracker-input-container">
                <label
                  className="generic-input-label cost-tracker-input-label"
                  htmlFor="equipment-quantity"
                >
                  Quantity
                </label>
                <input
                  className="generic-input"
                  type="text"
                  inputMode="decimal"
                  name="equipmentQuantity"
                  id="equipment-quantity"
                  placeholder="1"
                  ref={register({
                    required: true,
                    pattern: /^-?\d+\.?\d*$/,
                  })}
                  required
                />
                <p className="input-error-message">
                  {errors.equipmentQuantity && 'Please enter a number'}
                </p>
              </div>
            </div>
            
            <button className="generic-submit-button cost-tracker-form-submit-button">
              Add
            </button>
        </form>
      </section>
    </div>

      <article className="equipment-table-container">
        <h2 className="equipment-table-container__heading form-section-heading cost-tracker-form-section__heading">
          List of Equipment
        </h2>

        <div className="equipment-table-wrapper">
          {<ListOfEquipmentTable listOfEquipmentData={allEquipment} />}
        </div>
      </article>
    </>
  );
}

export default AddEquipment;
