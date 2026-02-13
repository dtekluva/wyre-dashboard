import UnAuthorizeResponse from './UnAuthorizeResponse';
import { getAlertAndAlarm, setAlertAndAlarm } from '../redux/actions/alertsAndAlarm/alertsAndAlarm.action';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox, notification } from 'antd';
import { useEffect, useState, useContext } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import CompleteDataContext from '../Context';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/alerts-and-alarms', name: 'Alerts and Alarms', id: 2 },
];

function AlertsAndAlarms({ alertsAndAlarms, getAlertAndAlarm, setAlertAndAlarm, match }) {
  const { setCurrentUrl, userData } = useContext(CompleteDataContext);
  const [preloadedAlertsFormData, setPreloadedAlertsFormData] = useState({});
  const [generator_data, setGenerator_data] = useState([]);
  const isOperator = userData.role_text === 'OPERATOR';

  const { control, handleSubmit, reset } = useForm({
    defaultValues: preloadedAlertsFormData,
  });

  useEffect(() => {
    if (match && match.url) setCurrentUrl(match.url);
  }, [match, setCurrentUrl]);

  // Fetch alerts
  useEffect(() => {
    getAlertAndAlarm();
  }, [getAlertAndAlarm]);

  // Update form when data arrives
  useEffect(() => {
    if (alertsAndAlarms) {
      const data = alertsAndAlarms?.alertsData?.data || {};
      setPreloadedAlertsFormData(data);
      setGenerator_data(alertsAndAlarms?.alertsData?.generator_data || []);
      reset(data); // Reset RHF form values
    }
  }, [alertsAndAlarms, reset]);

  const openNotification = (type, title, desc) => {
    notification[type]({ message: title, description: desc, duration: 6 });
  };

  const handleAlertsSubmit = async () => {
    const updatedAlertsFormData = { data: preloadedAlertsFormData, generator_data };
    const request = await setAlertAndAlarm(updatedAlertsFormData);
    if (request.fullfilled) {
      openNotification('success', 'Success', 'Your changes have been updated successfully');
    } else {
      openNotification('error', 'Error', 'Something unexpected occurred, please try again.');
    }
  };

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      {isOperator ? (
        <div className="alerts-and-alarms-form-content-wrapper">
          <h1 className="center-main-heading alerts-and-alarms-heading">
            Alerts and Alarms
          </h1>

          <form className="alerts-and-alarms-form" onSubmit={handleSubmit(handleAlertsSubmit)}>
            <fieldset className="alerts-and-alarms-form-inputs-wrapper">
              <legend className="alerts-and-alarms-form-section-heading">
                Standard Alerts on Anomalies
              </legend>

              <ol className="alerts-and-alarms-list">
                {/* Daily Energy Usage */}
                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <p className="alerts-and-alarms-question">Get energy usage alerts</p>
                    <div
                      className="alerts-and-alarms-subsection"
                      style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginLeft: '1.5rem', marginTop: '0.5rem' }}
                    >
                      <p className="alerts-and-alarms-subheading" style={{ fontWeight: 500 }}>Choose alert frequency</p>

                      {/* Daily */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="daily-diesel-usage-checkbox" className="alerts-and-alarms-subquestion">
                          Daily energy usage alerts
                        </label>
                        <Controller
                          name="dailyDieselUsageChecked"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="daily-diesel-usage-checkbox"
                              className="daily-diesel-usage-checkbox alerts-and-alarms-checkbox"
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                                setPreloadedAlertsFormData(prev => ({ ...prev, daily_energy_usage_alerts: e.target.checked }));
                              }}
                            />
                          )}
                        />
                      </div>

                      {/* Weekly */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="weekly-diesel-usage-checkbox" className="alerts-and-alarms-subquestion">
                          Weekly energy usage alerts
                        </label>
                        <Controller
                          name="weeklyDieselUsageChecked"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="weekly-diesel-usage-checkbox"
                              className="weekly-diesel-usage-checkbox alerts-and-alarms-checkbox"
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                                setPreloadedAlertsFormData(prev => ({ ...prev, weekly_energy_usage_alerts: e.target.checked }));
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </li>

                {/* Other standard alerts */}
                {[
                  { name: 'solarBatterySocChecked', label: 'Solar Battery Level Alerts', key: 'daily_battery_soc_alerts', id: 'solar-battery-soc-checkbox' },
                  { name: 'powerFactorChecked', label: 'Power Factor Alerts', key: 'power_factor_alerts', id: 'power-factor-checkbox' },
                  { name: 'loadBalanceIssuesChecked', label: 'Load balance issues detected', key: 'load_balance_alerts', id: 'load-balance-issues-checkbox' },
                  { name: 'frequencyVarianceChecked', label: 'Frequency variance', key: 'frequency_alerts', id: 'frequency-variance-checkbox' },
                  { name: 'voltageChecked', label: 'Voltage alerts', key: 'voltage_alerts', id: 'voltage-checkbox' },
                ].map(item => (
                  <li key={item.name} className="alerts-and-alarms-list-item">
                    <div className="alerts-and-alarms-question-container">
                      <p className="alerts-and-alarms-question">{item.label}</p>
                      <Controller
                        name={item.name}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={item.id}
                            className={`${item.key}-checkbox alerts-and-alarms-checkbox`}
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                              setPreloadedAlertsFormData(prev => ({ ...prev, [item.key]: e.target.checked }));
                            }}
                          />
                        )}
                      />
                    </div>
                  </li>
                ))}

                {/* Customised Alerts */}
                {[
                  { name: 'estimatedbaselineChecked', label: 'When forecasted baseline is reached', key: 'baseline_alerts', id: 'estimated-baseline-checkbox' },
                  { name: 'frequencyVarianceChecked', label: 'When set energy target is reached', key: 'energy_usage_alerts', id: 'set-baseline-checkbox' },
                  { name: 'eliminatedCo2Checked', label: 'When forecasted CO2 is reached', key: 'emitted_co2_alerts', id: 'eliminated-co2-checkbox' },
                  { name: 'setCo2Checked', label: 'When set CO2 is reached', key: 'set_co2_alerts', id: 'set-co2-checkbox' },
                  { name: 'generatorOnChecked', label: 'When any generator is turned on outside operating hours', key: 'operating_time_alerts', id: 'generator-on-checkbox' },
                  { name: 'loadExcessChecked', label: 'When load exceeds threshold', key: 'load_alerts', id: 'load-excess-checkbox' },
                ].map(item => (
                  <li key={item.name} className="alerts-and-alarms-list-item">
                    <div className="alerts-and-alarms-question-container">
                      <p className="alerts-and-alarms-question">{item.label}</p>
                      <Controller
                        name={item.name}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={item.id}
                            className={`${item.key}-checkbox alerts-and-alarms-checkbox`}
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                              setPreloadedAlertsFormData(prev => ({ ...prev, [item.key]: e.target.checked }));
                            }}
                          />
                        )}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </fieldset>

            <div style={{ marginBottom: '5%', marginLeft: '10%' }}>
              <button type="submit" className="generic-submit-button alert-and-alarms-button">
                Save Updates
              </button>
            </div>
          </form>
        </div>
      ) : (
        <UnAuthorizeResponse />
      )}
    </>
  );
}

const mapDispatchToProps = { getAlertAndAlarm, setAlertAndAlarm };
const mapStateToProps = (state) => ({ alertsAndAlarms: state.alertsAndAlarmReducer });
export default connect(mapStateToProps, mapDispatchToProps)(AlertsAndAlarms);
