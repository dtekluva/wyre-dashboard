import React, { useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, TimePicker, Select, notification } from 'antd';
import CompleteDataContext from '../Context';

import { CaretDownFilled } from '@ant-design/icons';

import BreadCrumb from '../components/BreadCrumb';


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/client-profile', name: 'Client Profile', id: 2 },
];

const { Option } = Select;
const { RangePicker } = TimePicker;

const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Update Sucessful',
    description: `${formName} details has been successfully updated`,
  });
};

function ClientProfile({ match }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const {
    register: registerClientDetails,
    handleSubmit: handleSubmitClientDetails,
    reset: resetClientDetails,
    setValue: setValueClientDetails,
    control: controlClientDetails,
    errors: errorsClientDetails,
  } = useForm();

  const {
    register: registerSiteDetails,
    handleSubmit: handleSubmitSiteDetails,
    reset: resetSiteDetails,
    setValue: setValueSiteDetails,
    control: controlSiteDetails,
    errors: errorsSiteDetails,
  } = useForm();

  const {
    register: registerDevice,
    handleSubmit: handleSubmitDevice,
    reset: resetDevice,
    setValue: setValueDevice,
    control: controlDevice,
    errors: errorsDevice,
  } = useForm();

  const customerTypeSelector = (
    <Select
      className="client-info-select h-4-br customer-type-selector"
      id="customer-type"
      defaultValue="multi-site"
      suffixIcon={<CaretDownFilled />}
      onChange={(e) =>
        setValueClientDetails('customerType', e.target.value, true)
      }
    >
      <Option className="customer-type-option" value="multi-site">
        Multi site
      </Option>
      <Option className="customer-type-option" value="single-site">
        Single site
      </Option>
    </Select>
  );

  const operatingHoursTimePicker = (
    <RangePicker
      className="client-info-time-picker"
      id="site-operating-hours"
      format={'HH:mm'}
      onChange={(e) =>
        setValueSiteDetails('siteOperatingHours', e.target.value, true)
      }
    />
  );

  const sourceTypeSelector = (
    <Select
      className="client-info-select h-4-br source-type-selector"
      id="source-type"
      defaultValue="utility"
      suffixIcon={<CaretDownFilled />}
      onChange={(e) => setValueDevice('sourceType', e.target.value, true)}
    >
      <Option className="source-type-option" value="utility">
        Utility
      </Option>
      <Option className="source-type-option" value="generator">
        Generator
      </Option>
      <Option className="source-type-option" value="solar">
        Solar
      </Option>
      <Option className="source-type-option" value="circuit/load">
        Circuit/Load
      </Option>
    </Select>
  );

  const nextMaintDatePicker = (
    <DatePicker
      format="DD-MM-YYYY"
      className="generic-input client-info-input"
      id="next-maint-date"
      onChange={(e) => setValueDevice('nextMaintDate', e.target.value, true)}
    />
  );

  const deviceTypeSelector = (
    <Select
      className="client-info-select h-4-br device-type-selector"
      id="device-type"
      defaultValue="1260331 - EM 137"
      suffixIcon={<CaretDownFilled />}
      onChange={(e) => setValueDevice('deviceType', e.target.value, true)}
    >
      <Option className="device-type-option" value="1260331 - EM 137">
        1260331 - EM 137
      </Option>
      <Option className="device-type-option" value="152621 - EM 113">
        152621 - EM 113
      </Option>
      <Option className="device-type-option" value="323225 - EM 112">
        323225 - EM 112
      </Option>
      <Option className="device-type-option" value="123456 - EM 222">
        123456 - EM 222
      </Option>
    </Select>
  );

  const onClientDetailsSubmit = ({
    clientName,
    phoneNumber,
    emailAddress,
    clientAddress,
    customerType,
    clientPhoto,
  }) => {
    console.log(
      clientName,
      phoneNumber,
      emailAddress,
      clientAddress,
      customerType,
      clientPhoto
    );

    openNotificationWithIcon('success', 'Client');

    // Reset form fields. Controller value is set manually
    setValueClientDetails('utilityPaymentPreDate', undefined);
    resetClientDetails();
  };

  const onSiteDetailsSubmit = ({
    siteName,
    siteAddress,
    contactPerson,
    siteOperatingHours,
  }) => {

    openNotificationWithIcon('success', 'Site');

    setValueSiteDetails('siteOperatingHours', undefined);
    resetSiteDetails();
  };

  const onDeviceSubmit = ({
    sourceName,
    sourceType,
    maintSchedule,
    nextMaintDate,
    deviceType,
  }) => {
    console.log(
      sourceName,
      sourceType,
      maintSchedule,
      nextMaintDate,
      deviceType
    );

    openNotificationWithIcon('success', 'Device');

    // Reset form fields. Controller value is set manually
    setValueDevice('sourceType', undefined);
    setValueDevice('nextMaintDate', undefined);
    resetDevice();
  };

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className="client-info-forms-content-wrapper">
        <h1 className="center-main-heading">Client Information</h1>

        <div className="all-client-info-forms">
          <form
            action="#"
            className="client-info-form"
            onSubmit={handleSubmitClientDetails(onClientDetailsSubmit)}
          >
            <legend className="form-section-heading client-info-form-section-heading">
              Client Details:
            </legend>

            <div className="client-info-form-inputs-wrapper">
              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="client-name"
                >
                  Client Name
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="clientName"
                  id="client-name"
                  // ref={registerClientDetails}
                  required
                  autoFocus
                />
              </div>

              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="phone-number"
                >
                  Phone Number
                </label>
                <input
                  className="generic-input"
                  type="text"
                  inputMode="decimal"
                  name="phoneNumber"
                  id="phone-number"
                  // ref={registerClientDetails({
                  //   required: true,
                  //   pattern: /^-?\d+\.?\d*$/,
                  // })}
                  required
                />
                <p className="input-error-message">
                  {errorsClientDetails?.phoneNumber && 'Please enter a number'}
                </p>
              </div>

              <div className="client-info-input-container h-no-mr">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="email-address"
                >
                  Email Address
                </label>
                <input
                  className="generic-input"
                  type="email"
                  name="emailAddress"
                  id="email-address"
                  // ref={registerClientDetails}
                  required
                />
              </div>

              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="client-address"
                >
                  Address
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="clientAddress"
                  id="client-address"
                  ref={registerClientDetails}
                  required
                />
              </div>

              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="customer-type"
                >
                  Customer Type
                </label>

                <Controller
                  as={customerTypeSelector}
                  name="customerType"
                  control={controlClientDetails}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  help={
                    errorsClientDetails?.customerType && 'Please select a value'
                  }
                />
                <p className="input-error-message">
                  {errorsClientDetails?.customerType && 'Please select a value'}
                </p>
              </div>

              <div className="client-info-input-container h-no-mr">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="client-photo"
                >
                  Upload Photo
                </label>
                <input
                  className="generic-input client-info-photo-picker"
                  type="file"
                  name="clientPhoto"
                  id="client-photo"
                  ref={registerClientDetails}
                  required
                />
              </div>
            </div>

            <button className="generic-submit-button client-info-form-submit-button">
              Save
            </button>
          </form>

          <form
            action="#"
            className="client-info-form"
            onSubmit={handleSubmitSiteDetails(onSiteDetailsSubmit)}
          >
            <legend className="form-section-heading client-info-form-section-heading">
              Site Details:
            </legend>

            <div className="client-info-form-inputs-wrapper">
              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="site-name"
                >
                  Site Name
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="siteName"
                  id="site-name"
                  ref={registerSiteDetails}
                  required
                />
              </div>

              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="site-address"
                >
                  Site Address
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="siteAddress"
                  id="site-address"
                  ref={registerSiteDetails}
                  required
                />
              </div>

              <div className="client-info-input-container h-no-mr">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="contact-person"
                >
                  Contact Person
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="contactPerson"
                  id="contact-person"
                  ref={registerSiteDetails}
                  required
                />
              </div>

              <div className="client-info-input-container h-no-growth">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="site-operating-hours"
                >
                  Operating Hours
                </label>
                <Controller
                  as={operatingHoursTimePicker}
                  name="siteOperatingHours"
                  control={controlSiteDetails}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  help={
                    errorsSiteDetails?.siteOperatingHours &&
                    'Please enter a time range'
                  }
                />
                <p className="input-error-message">
                  {errorsSiteDetails?.siteOperatingHours &&
                    'Please enter a time range'}
                </p>
              </div>
            </div>

            <button className="generic-submit-button client-info-form-submit-button">
              Save
            </button>
          </form>

          <form
            action="#"
            className="client-info-form"
            onSubmit={handleSubmitDevice(onDeviceSubmit)}
          >
            <legend className="form-section-heading client-info-form-section-heading">
              Device:
            </legend>

            <div className="client-info-form-inputs-wrapper">
              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="source-name"
                >
                  Source Name
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="sourceName"
                  id="source-name"
                  ref={registerDevice}
                  required
                />
              </div>

              <div className="client-info-input-container">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="source-type"
                >
                  Source Type
                </label>
                <Controller
                  as={sourceTypeSelector}
                  name="sourceType"
                  control={controlDevice}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  help={errorsDevice?.sourceType && 'Please select a value'}
                />
                <p className="input-error-message">
                  {errorsDevice?.sourceType && 'Please select a value'}
                </p>
              </div>

              <div className="client-info-input-container h-no-mr">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="maint-schedule"
                >
                  Maint. Schedule
                </label>
                <input
                  className="generic-input"
                  type="text"
                  name="maintSchedule"
                  id="maint-schedule"
                  ref={registerDevice}
                  required
                />
              </div>

              <div className="client-info-input-container h-no-growth">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="next-maint-date"
                >
                  Next Maint. Date
                </label>
                <Controller
                  as={nextMaintDatePicker}
                  name="nextMaintDate"
                  control={controlDevice}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  validateStatus={
                    errorsDevice?.nextMaintDate && 'Please enter a date'
                      ? 'error'
                      : ''
                  }
                  help={errorsDevice?.nextMaintDate && 'Please enter a date'}
                />
                <p className="input-error-message">
                  {errorsDevice?.nextMaintDate && 'Please enter a date'}
                </p>
              </div>

              <div className="client-info-input-container h-no-growth">
                <label
                  className="generic-input-label client-info-input-label"
                  htmlFor="device-type"
                >
                  Device
                </label>
                <Controller
                  as={deviceTypeSelector}
                  name="deviceType"
                  control={controlDevice}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  help={errorsDevice?.deviceType && 'Please select a value'}
                />
                <p className="input-error-message">
                  {errorsDevice?.deviceType && 'Please select a value'}
                </p>
              </div>
            </div>

            <button className="generic-submit-button client-info-form-submit-button">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ClientProfile;
