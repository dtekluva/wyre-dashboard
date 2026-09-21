import HiddenInputLabel from '../smallComponents/HiddenInputLabel';
import UnAuthorizeResponse from './UnAuthorizeResponse';
import { getAlertAndAlarm, setAlertAndAlarm } from '../redux/actions/alertsAndAlarm/alertsAndAlarm.action';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox, notification, Spin, Tag, TimePicker, Select } from 'antd';
import { useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import { useState } from 'react';
import { useContext } from 'react';
import CompleteDataContext from '../Context';
import { getUserProductAccess } from '../helpers/authHelper';

const DEFAULT_DAYS_OF_WEEK = '0,1,2,3,4,5,6';

const formatThresholdLabel = (threshold) => {
  const symbol = threshold.operator === 'gte' ? '≥' : '≤';
  return `${symbol} ${threshold.value}%`;
};

const formatScheduleTimeLabel = (time24) => {
  const [hoursRaw, minutesRaw] = time24.split(':');
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
};

const buildScheduleTimePayload = (scheduleTimes) =>
  scheduleTimes.map(({ time, days_of_week }) => {
    const entry = { time };
    if (days_of_week && days_of_week !== DEFAULT_DAYS_OF_WEEK) {
      entry.days_of_week = days_of_week;
    }
    return entry;
  });

const buildThresholdPayload = (thresholds) =>
  thresholds.map(({ operator, value }) => ({
    operator,
    value: Number(value),
  }));

const formatApiError = (errorPayload) => {
  if (!errorPayload) return 'Something unexpected occurred, please try again.';
  if (typeof errorPayload === 'string') return errorPayload;
  if (errorPayload.error) {
    if (typeof errorPayload.error === 'string') return errorPayload.error;
    const nested = Object.entries(errorPayload.error)
      .map(([key, value]) => {
        if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
        if (typeof value === 'object' && value !== null) return `${key}: ${JSON.stringify(value)}`;
        return `${key}: ${value}`;
      })
      .join('; ');
    if (nested) return nested;
  }
  if (errorPayload.message) return errorPayload.message;
  return 'Something unexpected occurred, please try again.';
};

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/alerts-and-alarms', name: 'Alerts and Alarms', id: 2 },
];

function AlertsAndAlarms({ alertsAndAlarms, getAlertAndAlarm, setAlertAndAlarm, match }) {
  const { setCurrentUrl, userData } = useContext(CompleteDataContext);
  const [preloadedAlertsFormData, setPreloadedAlertsFormData] = useState({});
  const [generator_data, setGenerator_data] = useState([]);
  const [batterySocConfig, setBatterySocConfig] = useState(undefined);
  const [scheduleTimes, setScheduleTimes] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [pendingScheduleTime, setPendingScheduleTime] = useState(null);
  const [pendingThresholdOperator, setPendingThresholdOperator] = useState('lte');
  const [pendingThresholdValue, setPendingThresholdValue] = useState('');
  const [scheduleTimeError, setScheduleTimeError] = useState('');
  const [thresholdError, setThresholdError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOperator = userData.role_text === "OPERATOR";
  const isSolarOnlyCustomer = getUserProductAccess(userData).isSolarOnly;
  const fetchAlertsDataLoading = alertsAndAlarms?.fetchAlertsDataLoading ?? false;
  const isFormBusy = fetchAlertsDataLoading || isSubmitting;
  
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
  }, [getAlertAndAlarm]);
  
  useEffect(() => {
    if (alertsAndAlarms?.alertsData) {
      const raw = alertsAndAlarms.alertsData.data || {};
      const thresholdRaw = raw.solar_capacity_utilization_threshold_pct;
      let thresholdPct = 90;
      if (thresholdRaw !== undefined && thresholdRaw !== null && thresholdRaw !== '') {
        const n = Number(thresholdRaw);
        thresholdPct = Number.isNaN(n) ? 90 : Math.min(90, Math.max(0, n));
      }
      const data = {
        ...raw,
        solar_capacity_utilization_alerts: raw.solar_capacity_utilization_alerts ?? false,
        solar_capacity_utilization_threshold_pct: thresholdPct,
      };
      const genData = alertsAndAlarms.alertsData.generator_data || [];
      const socConfig = alertsAndAlarms.alertsData.battery_soc_config ?? null;
      setPreloadedAlertsFormData(data);
      setGenerator_data(genData);
      setBatterySocConfig(socConfig);
      if (socConfig) {
        setScheduleTimes(
          (socConfig.schedule_times || []).map(({ time, days_of_week }) => ({
            time,
            days_of_week: days_of_week || DEFAULT_DAYS_OF_WEEK,
          }))
        );
        setThresholds(
          (socConfig.thresholds || []).map(({ operator, value }) => ({
            operator,
            value,
          }))
        );
      } else {
        setScheduleTimes([]);
        setThresholds([]);
      }
      setScheduleTimeError('');
      setThresholdError('');
      reset(data);
    }
  }, [alertsAndAlarms, reset]);

  const openNotification = (type, title, desc) => {
    notification[type]({
      message: `${title}`,
      description:`${desc}`,
      duration : 6
    });
  };

  const formatIntInputs = (e)=>{
    let convertdataToInt = parseFloat(e.target.value)
    const value = isNaN(convertdataToInt) ? '' : convertdataToInt
    return value
  }

  const showBatterySocBlock = batterySocConfig != null;

  const handleBatterySocEmailToggle = (checked) => {
    preloadedAlertsFormData.daily_battery_soc_alerts = checked;
    setPreloadedAlertsFormData((prev) => ({ ...prev, daily_battery_soc_alerts: checked }));
    if (batterySocConfig) {
      setBatterySocConfig((prev) => ({
        ...prev,
        email_enabled: checked,
        is_enabled: checked || prev.push_enabled,
      }));
    }
  };

  const handleBatterySocPushToggle = (checked) => {
    if (batterySocConfig) {
      setBatterySocConfig((prev) => ({
        ...prev,
        push_enabled: checked,
        is_enabled:
          checked ||
          prev.email_enabled ||
          Boolean(preloadedAlertsFormData.daily_battery_soc_alerts),
      }));
    }
  };

  const handleAddScheduleTime = () => {
    if (!pendingScheduleTime) {
      setScheduleTimeError('Select a time to add.');
      return;
    }
    const time = pendingScheduleTime.format('HH:mm');
    if (scheduleTimes.some((entry) => entry.time === time)) {
      setScheduleTimeError('This time is already scheduled.');
      return;
    }
    setScheduleTimes((prev) =>
      [...prev, { time, days_of_week: DEFAULT_DAYS_OF_WEEK }].sort((a, b) =>
        a.time.localeCompare(b.time)
      )
    );
    setPendingScheduleTime(null);
    setScheduleTimeError('');
  };

  const handleRemoveScheduleTime = (timeToRemove) => {
    setScheduleTimes((prev) => prev.filter((entry) => entry.time !== timeToRemove));
    setScheduleTimeError('');
  };

  const handleAddThreshold = () => {
    const raw = pendingThresholdValue;
    if (raw === '' || raw === null || raw === undefined) {
      setThresholdError('Enter a SOC percentage.');
      return;
    }
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setThresholdError('Enter a percentage from 0 to 100.');
      return;
    }
    const duplicate = thresholds.some(
      (entry) => entry.operator === pendingThresholdOperator && Number(entry.value) === value
    );
    if (duplicate) {
      setThresholdError('This threshold is already configured.');
      return;
    }
    setThresholds((prev) => [...prev, { operator: pendingThresholdOperator, value }]);
    setPendingThresholdValue('');
    setThresholdError('');
  };

  const handleRemoveThreshold = (index) => {
    setThresholds((prev) => prev.filter((_, i) => i !== index));
    setThresholdError('');
  };

  const handleAlertsSubmit = async () => {
    setIsSubmitting(true);
    try {
      const dataPayload = { ...preloadedAlertsFormData };
      const t = dataPayload.solar_capacity_utilization_threshold_pct;
      if (t === '' || t === null || t === undefined || Number.isNaN(Number(t))) {
        dataPayload.solar_capacity_utilization_threshold_pct = 90;
      } else {
        dataPayload.solar_capacity_utilization_threshold_pct = Math.min(
          90,
          Math.max(0, Number(t))
        );
      }
      const updatedAlertsFormData = {
        data: dataPayload,
        generator_data: generator_data,
      };

      if (batterySocConfig) {
        const emailEnabled = Boolean(dataPayload.daily_battery_soc_alerts);
        const pushEnabled = Boolean(batterySocConfig.push_enabled);
        updatedAlertsFormData.battery_soc_config = {
          is_enabled: emailEnabled || pushEnabled,
          push_enabled: pushEnabled,
          email_enabled: emailEnabled,
          schedule_times: buildScheduleTimePayload(scheduleTimes),
          thresholds: buildThresholdPayload(thresholds),
        };
      }

      const request = await setAlertAndAlarm(updatedAlertsFormData);
      if (request.fullfilled) {
        openNotification("success", "Success", "Your changes have been updated successfully");
        getAlertAndAlarm();
      } else {
        openNotification('error', 'Error', formatApiError(request.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {isOperator ?
        <div className="alerts-and-alarms-form-content-wrapper">
          <div className="alerts-and-alarms-page-header">
            <h1 className="center-main-heading alerts-and-alarms-heading">
              Alerts and Alarms
            </h1>
            <p className="alerts-and-alarms-lead">
              {isSolarOnlyCustomer
                ? 'Notifications for your solar system: battery state of charge, weather forecasts, and capacity utilization.'
                : 'Configure how Wyre notifies you about anomalies, solar performance, and operational events.'}
            </p>
          </div>

          <form
            action="#"
            className="alerts-and-alarms-form"
            onSubmit={handleSubmit(handleAlertsSubmit)}
          >
            <Spin
              spinning={isFormBusy}
              tip={fetchAlertsDataLoading ? 'Loading alerts...' : 'Saving updates...'}
            >
            <fieldset
              className="alerts-and-alarms-form-inputs-wrapper alerts-and-alarms-section-card"
              disabled={isFormBusy}
            >
              <legend className="alerts-and-alarms-form-section-heading">
                {isSolarOnlyCustomer
                  ? 'Solar system alerts'
                  : 'Standard Alerts on Anomalies'}
              </legend>
              <ol className="alerts-and-alarms-list">
                {!isSolarOnlyCustomer ? (
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
                          render={({ field }) => (
                            <Checkbox
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                preloadedAlertsFormData.daily_energy_usage_alerts = checked;
                                setPreloadedAlertsFormData(prev => ({ ...prev, daily_energy_usage_alerts: checked }));
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
                          render={({ field }) => (
                            <Checkbox
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                preloadedAlertsFormData.weekly_energy_usage_alerts = checked;
                                setPreloadedAlertsFormData(prev => ({ ...prev, weekly_energy_usage_alerts: checked }));
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
                ) : null}

                {showBatterySocBlock ? (
                <li className="alerts-and-alarms-list-item alerts-and-alarms-list-item--battery-soc">
                  <div className="battery-soc-block">
                    <ul className="battery-soc-toggle-list">
                      <li className="battery-soc-toggle-item">
                        <div className="alerts-and-alarms-question-container">
                          <label
                            htmlFor="solar-battery-soc-checkbox"
                            className="alerts-and-alarms-question"
                          >
                            Send battery SOC alerts by email
                          </label>
                          <Controller
                            name="solarBatterySocChecked"
                            defaultValue={preloadedAlertsFormData?.daily_battery_soc_alerts}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  field.onChange(checked);
                                  handleBatterySocEmailToggle(checked);
                                }}
                                checked={
                                  preloadedAlertsFormData?.daily_battery_soc_alerts ??
                                  batterySocConfig?.email_enabled
                                }
                                className="solar-battery-soc-checkbox alerts-and-alarms-checkbox"
                                id="solar-battery-soc-checkbox"
                              />
                            )}
                          />
                        </div>
                      </li>
                      <li className="battery-soc-toggle-item battery-soc-toggle-item--indented">
                        <div className="alerts-and-alarms-question-container">
                          <label
                            htmlFor="solar-battery-soc-push-checkbox"
                            className="alerts-and-alarms-question battery-soc-push-label"
                          >
                            Also notify the mobile app (push)
                          </label>
                          <Checkbox
                            id="solar-battery-soc-push-checkbox"
                            checked={Boolean(batterySocConfig?.push_enabled)}
                            onChange={(e) => handleBatterySocPushToggle(e.target.checked)}
                            className="solar-battery-soc-push-checkbox alerts-and-alarms-checkbox"
                          />
                        </div>
                      </li>
                    </ul>

                    <div className="battery-soc-panels">
                      <div className="battery-soc-panel">
                        <p className="battery-soc-panel-title">Scheduled updates</p>
                        <p className="battery-soc-config-hint">
                          Send a status email at each time (Africa/Lagos). Add as many as needed.
                          Granularity is 15 minutes.
                        </p>
                        <div className="battery-soc-chip-list">
                          {scheduleTimes.length > 0 ? (
                            scheduleTimes.map((entry) => (
                              <Tag
                                key={entry.time}
                                closable
                                onClose={(e) => {
                                  e.preventDefault();
                                  handleRemoveScheduleTime(entry.time);
                                }}
                                className="battery-soc-chip"
                              >
                                {formatScheduleTimeLabel(entry.time)}
                              </Tag>
                            ))
                          ) : (
                            <span className="battery-soc-empty-hint">No times configured yet.</span>
                          )}
                        </div>
                        <div className="battery-soc-add-row">
                          <TimePicker
                            value={pendingScheduleTime}
                            onChange={(value) => {
                              setPendingScheduleTime(value);
                              setScheduleTimeError('');
                            }}
                            format="HH:mm"
                            minuteStep={15}
                            needConfirm={false}
                            placeholder="Select time"
                            className="battery-soc-time-picker"
                          />
                          <button
                            type="button"
                            className="battery-soc-add-button"
                            onClick={handleAddScheduleTime}
                          >
                            Add time
                          </button>
                        </div>
                        {scheduleTimeError ? (
                          <p className="input-error-message">{scheduleTimeError}</p>
                        ) : null}
                      </div>

                      <div className="battery-soc-panel">
                        <p className="battery-soc-panel-title">When battery charge crosses</p>
                        <p className="battery-soc-config-hint">
                          Alert once when SOC hits a level you set — e.g. drops to 30% or rises to 80%.
                          It will not repeat until SOC recovers by about 3%.
                        </p>
                        <div className="battery-soc-chip-list">
                          {thresholds.length > 0 ? (
                            thresholds.map((entry, index) => (
                              <Tag
                                key={`${entry.operator}-${entry.value}-${index}`}
                                closable
                                onClose={(e) => {
                                  e.preventDefault();
                                  handleRemoveThreshold(index);
                                }}
                                className="battery-soc-chip"
                              >
                                {formatThresholdLabel(entry)}
                              </Tag>
                            ))
                          ) : (
                            <span className="battery-soc-empty-hint">No thresholds configured yet.</span>
                          )}
                        </div>
                        <div className="battery-soc-add-row">
                          <Select
                            value={pendingThresholdOperator}
                            onChange={setPendingThresholdOperator}
                            className="battery-soc-operator-select"
                            options={[
                              { value: 'lte', label: 'Drops to / below (≤)' },
                              { value: 'gte', label: 'Rises to / above (≥)' },
                            ]}
                          />
                          <input
                            className="alerts-and-alarms-input battery-soc-threshold-input"
                            type="text"
                            inputMode="decimal"
                            placeholder="30"
                            value={pendingThresholdValue}
                            onChange={(e) => {
                              setPendingThresholdValue(formatIntInputs(e));
                              setThresholdError('');
                            }}
                            aria-label="SOC threshold percentage"
                          />
                          <span className="alerts-and-alarms-unit">%</span>
                          <button
                            type="button"
                            className="battery-soc-add-button"
                            onClick={handleAddThreshold}
                          >
                            Add threshold
                          </button>
                        </div>
                        {thresholdError ? (
                          <p className="input-error-message">{thresholdError}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
                ) : null}

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    {' '}
                    <label
                      htmlFor="daily-unfavorable-weather-checkbox"
                      className="alerts-and-alarms-question"
                    >
                      Daily Unfavourable Weather Alerts
                    </label>{' '}
                    <Controller
                      name="dailyUnfavorableWeatherChecked"
                      defaultValue={preloadedAlertsFormData?.daily_unfavorable_weather_alerts}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          onChange={(e) => {
                            const checked = e.target.checked;
                            field.onChange(checked);
                            preloadedAlertsFormData.daily_unfavorable_weather_alerts = checked;
                            setPreloadedAlertsFormData(prev => ({ ...prev, daily_unfavorable_weather_alerts: checked }));
                          }}
                          checked={preloadedAlertsFormData?.daily_unfavorable_weather_alerts}
                          className="daily-unfavorable-weather-checkbox alerts-and-alarms-checkbox"
                          id="daily-unfavorable-weather-checkbox"
                        />
                      )}
                    />
                  </div>
                </li>

                <li className="alerts-and-alarms-list-item">
                  <div className="alerts-and-alarms-question-container">
                    <div>
                      <p className="alerts-and-alarms-question">
                        <label
                          className="h-screen-reader-text"
                          htmlFor="solar-capacity-utilization-threshold"
                        >
                          Solar capacity utilization threshold percentage
                        </label>
                        When solar capacity utilization exceeds{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="solarCapacityUtilizationThreshold"
                          id="solar-capacity-utilization-threshold"
                          placeholder="90"
                          value={
                            preloadedAlertsFormData?.solar_capacity_utilization_threshold_pct ?? ''
                          }
                          onChange={(e) => {
                            let val = formatIntInputs(e);
                            if (val !== '' && val !== undefined && val !== null) {
                              const n = Number(val);
                              if (!Number.isNaN(n)) {
                                val = Math.min(90, Math.max(0, n));
                              }
                            }
                            preloadedAlertsFormData.solar_capacity_utilization_threshold_pct = val;
                            setPreloadedAlertsFormData((prev) => ({
                              ...prev,
                              solar_capacity_utilization_threshold_pct: val,
                            }));
                          }}
                          ref={register('solarCapacityUtilizationThreshold', {
                            validate: (value) => {
                              if (value === '' || value === null || value === undefined) {
                                return true;
                              }
                              const n = Number(value);
                              if (Number.isNaN(n)) return false;
                              if (n < 0 || n > 90) return false;
                              return true;
                            },
                          })}
                        />{' '}
                        <span className="alerts-and-alarms-unit">%</span>
                        {' '}of installed capacity
                      </p>
                      <p className="input-error-message">
                        {errors.solarCapacityUtilizationThreshold &&
                          'Enter a percentage from 0 to 90'}
                      </p>
                    </div>

                    <div>
                      <HiddenInputLabel
                        htmlFor="solar-capacity-utilization-checkbox"
                        labelText="Solar capacity utilization alerts"
                      />
                      <Controller
                        name="solarCapacityUtilizationChecked"
                        defaultValue={preloadedAlertsFormData?.solar_capacity_utilization_alerts}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.solar_capacity_utilization_alerts = checked;
                              setPreloadedAlertsFormData((prev) => ({
                                ...prev,
                                solar_capacity_utilization_alerts: checked,
                              }));
                            }}
                            checked={preloadedAlertsFormData?.solar_capacity_utilization_alerts}
                            className="solar-capacity-utilization-checkbox alerts-and-alarms-checkbox"
                            id="solar-capacity-utilization-checkbox"
                          />
                        )}
                      />
                    </div>
                  </div>
                </li>

                {!isSolarOnlyCustomer ? (
                <>
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
                          ref={register('highPowerFactor', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
                          placeholder={preloadedAlertsFormData?.max_power_factor}
                          value={preloadedAlertsFormData?.max_power_factor ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.max_power_factor = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, max_power_factor: val }));
                          }}
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
                          value={preloadedAlertsFormData?.min_power_factor ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.min_power_factor = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, min_power_factor: val }));
                          }}
                          ref={register('lowPowerFactor', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.power_factor_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, power_factor_alerts: checked }));
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
render={({ field }) => (
                        <Checkbox
                          onChange={(e) => {
                            const checked = e.target.checked;
                            field.onChange(checked);
                            preloadedAlertsFormData.load_balance_alerts = checked;
                            setPreloadedAlertsFormData(prev => ({ ...prev, load_balance_alerts: checked }));
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
                          value={preloadedAlertsFormData?.frequency_precision ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.frequency_precision = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, frequency_precision: val }));
                          }}
                          ref={register('frequencyVariance', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.frequency_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, frequency_alerts: checked }));
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
                          value={preloadedAlertsFormData?.max_voltage ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.max_voltage = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, max_voltage: val }));
                          }}
                          ref={register('highVoltage', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
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
                          value={preloadedAlertsFormData?.min_voltage ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.min_voltage = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, min_voltage: val }));
                          }}
                          ref={register('lowVoltage', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.voltage_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, voltage_alerts: checked }));
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
                </>
                ) : null}
              </ol>

              {isSolarOnlyCustomer ? (
                <div className="alert-and-alarms-button-container">
                  <button
                    type="submit"
                    className="generic-submit-button alert-and-alarms-button"
                    disabled={isFormBusy}
                  >
                    {isSubmitting ? 'Saving...' : fetchAlertsDataLoading ? 'Loading...' : 'Save Updates'}
                  </button>
                </div>
              ) : null}
            </fieldset>

            {!isSolarOnlyCustomer ? (
            <fieldset
              className="alerts-and-alarms-form-inputs-wrapper alerts-and-alarms-section-card h-second"
              disabled={isFormBusy}
            >
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.baseline_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, baseline_alerts: checked }));
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
                        <label htmlFor="energy-usage-max">
                          {' '}
                          When set energy target is reached
                        </label>{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="energyUsageMax"
                          id="energy-usage-max"
                          placeholder={preloadedAlertsFormData?.energy_usage_max}
                          value={preloadedAlertsFormData?.energy_usage_max ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.energy_usage_max = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, energy_usage_max: val }));
                          }}
                          ref={register('energyUsageMax', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
                        />
                        <span className="alerts-and-alarms-unit">kWh</span>
                      </p>
                      <p className="input-error-message">
                        {errors.energyUsageMax &&
                          'Energy target must be a number'}
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.energy_usage_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, energy_usage_alerts: checked }));
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.emitted_co2_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, emitted_co2_alerts: checked }));
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
                        <label htmlFor="set-co2-value">
                          {' '}
                          When set CO<sub>2</sub> is reached
                        </label>{' '}
                        <input
                          className="alerts-and-alarms-input"
                          type="text"
                          inputMode="decimal"
                          name="setCo2Value"
                          id="set-co2-value"
                          placeholder={preloadedAlertsFormData?.set_co2_value}
                          value={preloadedAlertsFormData?.set_co2_value ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.set_co2_value = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, set_co2_value: val }));
                          }}
                          ref={register('setCo2Value', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
                        />
                        <span className="alerts-and-alarms-unit">tons</span>
                      </p>
                      <p className="input-error-message">
                        {errors.setCo2Value &&
                          'CO2 value must be a number'}
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.set_co2_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, set_co2_alerts: checked }));
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.operating_time_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, operating_time_alerts: checked }));
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
                          value={preloadedAlertsFormData?.load_threshold_value ?? ''}
                          onChange={(e) => {
                            const val = formatIntInputs(e);
                            preloadedAlertsFormData.load_threshold_value = val;
                            setPreloadedAlertsFormData(prev => ({ ...prev, load_threshold_value: val }));
                          }}
                          ref={register('loadExcess', {
                            pattern: /^-?\d+\.?\d*$/,
                          })}
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
                        render={({ field }) => (
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              preloadedAlertsFormData.load_alerts = checked;
                              setPreloadedAlertsFormData(prev => ({ ...prev, load_alerts: checked }));
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

                {/* Generator maintenance datepicker: if uncommenting, add moment import, setGenData/defaultDate helpers, DatePicker from antd.
                {generator_data.length > 0 && 
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

              <div className="alert-and-alarms-button-container">
                <button
                  type="submit"
                  className="generic-submit-button alert-and-alarms-button"
                  disabled={isFormBusy}
                >
                  {isSubmitting ? 'Saving...' : fetchAlertsDataLoading ? 'Loading...' : 'Save Updates'}
                </button>
              </div>
            </fieldset>
            ) : null}
            </Spin>

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