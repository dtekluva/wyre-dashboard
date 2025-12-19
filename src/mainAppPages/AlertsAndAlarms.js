import moment from 'moment';
import HiddenInputLabel from '../smallComponents/HiddenInputLabel';
import UnAuthorizeResponse from './UnAuthorizeResponse';
import { getAlertAndAlarm, setAlertAndAlarm } from '../redux/actions/alertsAndAlarm/alertsAndAlarm.action';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox, Collapse, Form, notification } from 'antd';
import { useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import { useState } from 'react';
import { useContext } from 'react';
import CompleteDataContext from '../Context';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/alerts-and-alarms', name: 'Alerts and Alarms', id: 2 },
];

const { Panel } = Collapse;

function AlertsAndAlarms({ alertsAndAlarms, getAlertAndAlarm, setAlertAndAlarm, match }) {

  const { setCurrentUrl, token, userId, userData } = useContext(CompleteDataContext);
  const [preloadedAlertsFormData, setPreloadedAlertsFormData] = useState({});
  const [generator_data, setGenerator_data] = useState([])
  const isDataReady = preloadedAlertsFormData && preloadedAlertsFormData
  const isOperator = userData.role_text === "OPERATOR";

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: preloadedAlertsFormData,
  });


  // Get all alerts
  useEffect(() => {
    getAlertAndAlarm();
  }, []);

  useEffect(() => {
    if (alertsAndAlarms) {
      setPreloadedAlertsFormData(alertsAndAlarms?.alertsData?.data)
      setGenerator_data(alertsAndAlarms?.alertsData?.generator_data)
    }
  }, [alertsAndAlarms]);

  const openNotification = (type, title, desc) => {
    notification[type]({
      message: `${title}`,
      description: `${desc}`,
      duration: 6
    });
  };

  const formatIntInputs = (e) => {
    let convertdataToInt = parseFloat(e.target.value)
    const value = isNaN(convertdataToInt) ? '' : convertdataToInt
    return value
  }

  const setGenData = (id, dateString) => {
    if (dateString !== "Invalid date") {
      let specGen = generator_data && generator_data.filter((data) => {
        return data.id === id
      })
      for (const key in specGen) {
        const gottenData = specGen[key].next_maintenance_date = dateString
      }
      let obj = Object.keys(generator_data).forEach((e) => {
        if (e === id) {
          generator_data[e] = {
            specGen
          }
        }
      })
      return generator_data
    }
  }

  const defaultDate = (data) => {
    let date = data && data.next_maintenance_date
    if (date === null) {
      return;
    }
    else {
      return moment(date, 'YYYY-MM-DD')
    }
  }

  const handleAlertsSubmit = async () => {
    const updatedAlertsFormData = {
      'data': preloadedAlertsFormData,
      'generator_data': generator_data
    };
    const request = await setAlertAndAlarm(updatedAlertsFormData);

    if (request.fullfilled) {
      openNotification("success", "Success", "Your changes has been updated succesfully");
    } else {
      openNotification('error', "Error", 'Something un-expected occured, please try again.')
    }
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {isOperator ?
        <div className="alerts-and-alarms-form-content-wrapper">
          <h1 className="center-main-heading alerts-and-alarms-heading">
            Alerts and Alarms
          </h1>

          <form
            action="#"
            className="alerts-and-alarms-form"
            onSubmit={handleAlertsSubmit}
          >
            <fieldset className="alerts-and-alarms-form-inputs-wrapper">
              <legend className="alerts-and-alarms-form-section-heading">
                Standard Alerts on Anomalies
              </legend>
              <ol className="alerts-and-alarms-list">
                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <p className="alerts-and-alarms-question">
                      Get energy usage alerts
                    </p>

                    <div
                      className="alerts-and-alarms-subsection"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        marginLeft: "1.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p className="alerts-and-alarms-subheading" style={{ fontWeight: 500 }}>
                        Choose alert frequency
                      </p>

                      {/* Daily diesel usage alert */}
                      <div
                        className="alerts-and-alarms-suboption"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <label
                          htmlFor="daily-diesel-usage-checkbox"
                          className="alerts-and-alarms-subquestion"
                        >
                          Daily energy usage alerts
                        </label>
                        <Controller
                          name="dailyDieselUsageChecked"
                          defaultValue={preloadedAlertsFormData?.daily_energy_usage_alerts}
                          control={control}
                          render={(props) => (
                            <Checkbox
                              onChange={(e) => {
                                props.onChange(e.target.checked);
                                preloadedAlertsFormData.daily_energy_usage_alerts =
                                  e.target.checked;
                              }}
                              checked={preloadedAlertsFormData?.daily_energy_usage_alerts}
                              className="daily-diesel-usage-checkbox alerts-and-alarms-checkbox"
                              id="daily-diesel-usage-checkbox"
                            />
                          )}
                        />
                      </div>

                      {/* Weekly diesel usage alert */}
                      <div
                        className="alerts-and-alarms-suboption"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <label
                          htmlFor="weekly-diesel-usage-checkbox"
                          className="alerts-and-alarms-subquestion"
                        >
                          Weekly energy usage alerts
                        </label>
                        <Controller
                          name="weeklyDieselUsageChecked"
                          defaultValue={preloadedAlertsFormData?.weekly_energy_usage_alerts}
                          control={control}
                          render={(props) => (
                            <Checkbox
                              onChange={(e) => {
                                props.onChange(e.target.checked);
                                preloadedAlertsFormData.weekly_energy_usage_alerts =
                                  e.target.checked;
                              }}
                              checked={preloadedAlertsFormData?.weekly_energy_usage_alerts}
                              className="weekly-diesel-usage-checkbox alerts-and-alarms-checkbox"
                              id="weekly-diesel-usage-checkbox"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        Power factor exceeds{' '}
                        <label
                          className="h-screen-reader-text"
                          htmlFor="high-power-factor"
                        >
                          a high power factor of
                        </label>
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          width="50"
                          name="highPowerFactor"
                          id="high-power-factor"

                          placeholder={preloadedAlertsFormData?.max_power_factor}
                          value={preloadedAlertsFormData?.max_power_factor}
                          onChange={(e) => {
                            e.preventDefault()
                            // setmax_power_factor(e.target.value)
                            preloadedAlertsFormData.max_power_factor = formatIntInputs(e)
                          }}
                          {...register("amount", {
                            pattern: {
                              value: /^-?\d+\.?\d*$/,
                              message: "Invalid number"
                            }
                          })}
                          autoFocus
                        />{' '}
                        or goes below{' '}
                        <label
                          className="h-screen-reader-text"
                          htmlFor="high-power-factor"
                        >
                          a low power factor of
                        </label>
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="lowPowerFactor"
                          id="low-power-factor"
                          placeholder={preloadedAlertsFormData?.min_power_factor}
                          value={preloadedAlertsFormData?.min_power_factor}
                          onChange={(e) => {
                            e.preventDefault()
                            // setmin_power_factor(e.target.value)
                            preloadedAlertsFormData.min_power_factor = formatIntInputs(e)
                          }}
                        />
                      </p>
                      <p className="input-error-message">
                        {(errors.highPowerFactor || errors.lowPowerFactor) &&
                          'Power factor values must be numbers'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="power-factor-checkbox"
                        labelText="Power Factor"
                      />
                      <Controller
                        name="powerFactorChecked"
                        defaultValue={preloadedAlertsFormData?.power_factor_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setpower_factor_alerts(e.target.checked)
                              preloadedAlertsFormData.power_factor_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.power_factor_alerts}
                            className="power-factor-checkbox alerts-and-alarms-checkbox"
                            id="power-factor-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    {' '}
                    <label
                      htmlFor="load-balance-issues-checkbox"
                      className="alerts-and-alarms-question"
                    >
                      Load balance issues detected
                    </label>{' '}
                    <Controller
                      name="loadBalanceIssuesChecked"
                      defaultValue={preloadedAlertsFormData?.load_balance_alerts}
                      control={control}
                      render={(props) => (
                        <Checkbox
                          onChange={(e) => {
                            props.onChange(e.target.checked)
                            // setload_balance_alerts(e.target.checked)
                            preloadedAlertsFormData.load_balance_alerts = e.target.checked
                          }}
                          checked={preloadedAlertsFormData?.load_balance_alerts}
                          className="load-balance-issues-checkbox alerts-and-alarms-checkbox"
                          id="load-balance-issues-checkbox"
                        />
                      )}
                    />
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        <label htmlFor="frequency-variance-factor">
                          {' '}
                          Frequency variance between threshold ±
                        </label>{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="frequencyVariance"
                          id="frequency-variance-factor"
                          placeholder={preloadedAlertsFormData?.frequency_precision}
                          value={preloadedAlertsFormData?.frequency_precision}
                          onChange={(e) => {
                            // setfrequency_precision(e.target.value)
                            preloadedAlertsFormData.frequency_precision = formatIntInputs(e)
                          }}
                        />
                      </p>
                      <p className="input-error-message">
                        {errors.frequencyVariance &&
                          'Frequency variance must be a number'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="frequency-variance-checkbox"
                        labelText="Frequency Variance"
                      />
                      <Controller
                        name="frequencyVarianceChecked"
                        defaultValue={preloadedAlertsFormData?.frequency_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setFrequency_alerts(e.target.checked)
                              preloadedAlertsFormData.frequency_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.frequency_alerts}
                            className="frequency-variance-checkbox alerts-and-alarms-checkbox"
                            id="frequency-variance-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        Voltage exceeds{' '}
                        <label
                          className="h-screen-reader-text"
                          htmlFor="high-voltage"
                        >
                          a high voltage of
                        </label>
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="highVoltage"
                          id="high-voltage"
                          placeholder={preloadedAlertsFormData?.max_voltage}
                          value={preloadedAlertsFormData?.max_voltage}
                          onChange={(e) => {
                            // setmax_voltage(e.target.value)
                            preloadedAlertsFormData.max_voltage = formatIntInputs(e)
                          }}
                        />{' '}
                        <span className="alerts-and-alarms-unit">volts</span> or
                        goes below{' '}
                        <label
                          className="h-screen-reader-text"
                          htmlFor="low-voltage"
                        >
                          a low power factor of
                        </label>
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="lowVoltage"
                          id="low-voltage"
                          placeholder={preloadedAlertsFormData?.min_voltage}
                          value={preloadedAlertsFormData?.min_voltage}
                          onChange={(e) => {
                            // setmin_voltage(e.target.value)
                            preloadedAlertsFormData.min_voltage = formatIntInputs(e)
                          }}
                        />{' '}
                        <span className="alerts-and-alarms-unit">volts</span>
                      </p>
                      <p className="input-error-message">
                        {(errors.highVoltage || errors.lowVoltage) &&
                          'Voltage values must be numbers'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="voltage-checkbox"
                        labelText="Voltage"
                      />

                      <Controller
                        name="voltageChecked"
                        defaultValue={preloadedAlertsFormData?.voltage_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setvoltage_alerts(e.target.checked)
                              preloadedAlertsFormData.voltage_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.voltage_alerts}
                            className="voltage-checkbox alerts-and-alarms-checkbox"
                            id="voltage-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>
              </ol>
            </fieldset>

            <fieldset className="alerts-and-alarms-form-inputs-wrapper h-second">
              <legend className="alerts-and-alarms-form-section-heading">
                Customised Alerts on Selected Events
              </legend>

              <ol className="alerts-and-alarms-list">
                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <label htmlFor="estimated-baseline-checkbox" className="alerts-and-alarms-question-container">
                      When forecasted baseline is reached
                    </label>
                    <div>
                      <Controller
                        name="estimatedbaselineChecked"
                        defaultValue={preloadedAlertsFormData?.baseline_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setbaseline_alerts(e.target.checked)
                              preloadedAlertsFormData.baseline_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.baseline_alerts}
                            className="estimated-baseline-checkbox alerts-and-alarms-checkbox"
                            id="estimated-baseline-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        <label htmlFor="set-baseline">
                          {' '}
                          When set energy target is reached
                        </label>{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="set-baseline"
                          id="set-baseline"
                          placeholder={preloadedAlertsFormData?.energy_usage_max}
                          value={preloadedAlertsFormData?.energy_usage_max}
                          onChange={(e) => {
                            // setEnergy_usage_max(e.target.value)
                            preloadedAlertsFormData.energy_usage_max = formatIntInputs(e)
                          }}
                        />
                        <span className="alerts-and-alarms-unit">kWh</span>
                      </p>
                      <p className="input-error-message">
                        {errors.frequencyVariance &&
                          'Frequency variance must be a number'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="set-baseline-checkbox"
                        labelText="set baseline"
                      />
                      <Controller
                        name="frequencyVarianceChecked"
                        defaultValue={preloadedAlertsFormData?.energy_usage_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setEnergy_usage_alerts(e.target.checked)
                              preloadedAlertsFormData.energy_usage_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.energy_usage_alerts}
                            className="set-baseline-checkbox alerts-and-alarms-checkbox"
                            id="set-baseline-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    {' '}
                    <label
                      htmlFor="eliminated-co2-checkbox"
                      className="alerts-and-alarms-question"
                    >
                      When forecasted CO<sub>2</sub> is reached
                    </label>{' '}
                    <div>
                      <Controller
                        name="eliminatedCo2Checked"
                        defaultValue={preloadedAlertsFormData?.emitted_co2_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setemitted_co2_alerts(e.target.checked)
                              preloadedAlertsFormData.emitted_co2_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.emitted_co2_alerts}
                            className="eliminated-co2-checkbox alerts-and-alarms-checkbox"
                            id="eliminated-co2-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>


                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        <label htmlFor="set-baseline">
                          {' '}
                          When set CO<sub>2</sub> is reached
                        </label>{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="set-baseline"
                          id="set-baseline"
                          placeholder={preloadedAlertsFormData?.set_co2_value}
                          value={preloadedAlertsFormData?.set_co2_value}
                          onChange={(e) => {
                            // reset_co2_value(e.target.value)
                            preloadedAlertsFormData.set_co2_value = formatIntInputs(e)
                          }}
                        />
                        <span className="alerts-and-alarms-unit">tons</span>
                      </p>
                      <p className="input-error-message">
                        {errors.frequencyVariance &&
                          'Frequency variance must be a number'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="set-baseline-checkbox"
                        labelText="set baseline"
                      />
                      <Controller
                        name="setCo2Checked"
                        defaultValue={preloadedAlertsFormData?.set_co2_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setSet_co2_alerts(e.target.checked)
                              preloadedAlertsFormData.set_co2_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.set_co2_alerts}
                            className="set-co2-checkbox alerts-and-alarms-checkbox"
                            id="set-co2-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    {' '}
                    <label
                      htmlFor="generator-on-checkbox"
                      className="alerts-and-alarms-question"
                    >
                      When any generator is turned on outside operating hours
                    </label>{' '}
                    <div>
                      <Controller
                        name="generatorOnChecked"
                        defaultValue={preloadedAlertsFormData?.operating_time_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setoperating_time_alerts(e.target.checked)
                              preloadedAlertsFormData.operating_time_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.operating_time_alerts}
                            className="generator-on-checkbox alerts-and-alarms-checkbox"
                            id="generator-on-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        When <label htmlFor="load-excess">load</label> exceeds{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="loadExcess"
                          id="load-excess"
                          placeholder={preloadedAlertsFormData?.load_threshold_value}
                          onChange={(e) => {
                            // setload_threshold_value(e.target.value)
                            preloadedAlertsFormData.load_threshold_value = formatIntInputs(e)
                          }}
                        />{' '}
                        <span className="alerts-and-alarms-unit">kW</span>
                      </p>
                      <p className="input-error-message">
                        {errors.loadExcess &&
                          'Load excess value must be a number'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="load-excess-checkbox"
                        labelText="Load Excess"
                      />

                      <Controller
                        name="loadExcessChecked"
                        defaultValue={preloadedAlertsFormData?.load_alerts}
                        control={control}
                        render={(props) => (
                          <Checkbox
                            onChange={(e) => {
                              props.onChange(e.target.checked)
                              // setload_alerts(e.target.checked)
                              preloadedAlertsFormData.load_alerts = e.target.checked
                            }}
                            checked={preloadedAlertsFormData?.load_alerts}
                            className="load-excess-checkbox alerts-and-alarms-checkbox"
                            id="load-excess-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                {/* <li className="alerts-and-alarms-list-item">
                <div className="alerts-and-alarms-question-container">
                  {' '}
                  <label
                    htmlFor="priority-power-unused-checkbox"
                    className="alerts-and-alarms-question"
                  >
                    When priority power is available and generator is still
                    being used
                  </label>{' '}
                  <div>
                    <Controller
                      name="priorityPowerUnusedChecked"
                      defaultValue={false}
                      control={control}
                      render={(props) => (
                        <Checkbox
                          onChange={(e) => props.onChange(e.target.checked)}
                          checked={props.value}
                          className="priority-power-unused-checkbox alerts-and-alarms-checkbox"
                          id="priority-power-unused-checkbox"
                        />
                      )}
                    />
                  </div>
                </div>
              </li> */}

                {/* {generator_data.length > 0 && 
                 <li className="alerts-and-alarms-list-item">
                 <div className="alerts-and-alarms-question-container">
                   {' '}
                   <label
                     htmlFor="generator-maintenance-time-checkbox"
                     className="alerts-and-alarms-question"
                   >
                     When set generator maintenance time is drawing close
                   </label>{' '}
                   <div>
                     <Controller
                       name="generatorMaintenanceTimeChecked"
                       defaultValue={preloadedAlertsFormData.generator_maintenance_alert}
                       control={control}
                       render={(props) => (
                         <Checkbox
                           onChange={(e) => {
                             props.onChange(e.target.checked)
                             setgenerator_maintenance_alert(e.target.checked)
                             preloadedAlertsFormData.generator_maintenance_alert = e.target.checked
                           }}
                           checked={preloadedAlertsFormData.generator_maintenance_alert}
                           className="generator-maintenance-time-checkbox alerts-and-alarms-checkbox"
                           id="generator-maintenance-time-checkbox"
                         />
                       )}
                     />
                   </div>
                 </div>
                 <div style={{marginTop:'20px'}}>
                   <ol>
                     {generator_data.length > 0 ? generator_data.map((data, index)=>(
                       <li  style={{marginBottom:'10px'}} key={data.id}>
                           <div style={{display:'flex',alignItems:'center', justifyContent:'flex-start'}}>
                             <span style={{width:'50%'}}>{index + 1}. {data.name} </span>
                               <span style={{marginLeft:'20px'}} className='alerts-and-alarms-datepicker'> 
                                   <DatePicker 
                                     onChange={(e)=>{
                                       setGenData(data.id,moment(e).format('YYYY-MM-DD'))
                                     }}
                                     format="DD-MM-YYYY"
                                     dateRender={current => {
                                       const style = {};
                                       if (current.date() === data.next_maintenance_date) {
                                         style.border = '1px solid #1890ff';
                                         style.borderRadius = '50%';
                                       }
                                       return (
                                         <div className="ant-picker-cell-inner" style={style}>
                                           {current.date()}
                                         </div>
                                       );
                                     }}
                                     defaultValue={defaultDate(data)}
                                   />
                               </span>
                           </div>
                       </li>
                     ))
                     : null
                     }
                   </ol>
                 </div>
               </li>
              } */}

              </ol>

              <div style={{ marginBottom: '5%', marginLeft: '10%' }}>
                <button
                  type="submit"
                  className="generic-submit-button alert-and-alarms-button" >
                  Save Updates
                </button>
              </div>
            </fieldset>

          </form>
        </div>
        :
        <UnAuthorizeResponse />
      }
    </>
  );
}

const mapDispatchToProps = {
  getAlertAndAlarm,
  setAlertAndAlarm
};

const mapStateToProps = (state) => ({
  alertsAndAlarms: state.alertsAndAlarmReducer
});
export default connect(mapStateToProps, mapDispatchToProps)(AlertsAndAlarms);