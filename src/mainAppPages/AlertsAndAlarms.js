import { useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { notification, Select, Spin, Switch, Tag, TimePicker } from 'antd';

import UnAuthorizeResponse from './UnAuthorizeResponse';
import BreadCrumb from '../components/BreadCrumb';
import CompleteDataContext from '../Context';
import { getUserProductAccess } from '../helpers/authHelper';
import { getAlertAndAlarm, setAlertAndAlarm } from '../redux/actions/alertsAndAlarm/alertsAndAlarm.action';

const DEFAULT_DAYS_OF_WEEK = '0,1,2,3,4,5,6';
const MAX_SCHEDULE_TIMES = 2;

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const numberPattern = { pattern: /^-?\d+\.?\d*$/ };

const solarCapacityRules = {
  validate: (value) => {
    if (value === '' || value === null || value === undefined) return true;
    const n = Number(value);
    if (Number.isNaN(n) || n < 0 || n > 90) return false;
    return true;
  },
};

const SAVED_LIMIT_KEYS = [
  'solar_capacity_utilization_threshold_pct',
  'max_power_factor',
  'min_power_factor',
  'frequency_precision',
  'max_voltage',
  'min_voltage',
  'energy_usage_max',
  'set_co2_value',
  'load_threshold_value',
];

const limitsMatch = (current, saved) => {
  const blank = (value) => value === '' || value === null || value === undefined;
  if (blank(current) && blank(saved)) return true;
  if (blank(current) || blank(saved)) return false;
  const currentNumber = Number(current);
  const savedNumber = Number(saved);
  if (!Number.isNaN(currentNumber) && !Number.isNaN(savedNumber)) {
    return currentNumber === savedNumber;
  }
  return String(current) === String(saved);
};

const scheduleTimesMatch = (current, saved) => {
  const currentTimes = (current || []).map((entry) => entry.time);
  const savedTimes = (saved || []).map((entry) => entry.time);
  return currentTimes.length === savedTimes.length
    && currentTimes.every((time, index) => time === savedTimes[index]);
};

const thresholdValuesMatch = (current, saved) => {
  const currentThresholds = limitThresholds(current || []);
  const savedThresholds = limitThresholds(saved || []);
  return currentThresholds.length === savedThresholds.length
    && currentThresholds.every((entry, index) => (
      entry.operator === savedThresholds[index].operator
      && Number(entry.value) === Number(savedThresholds[index].value)
    ));
};

const normalizeDaysCsv = (csv) => {
  const parts = String(csv || DEFAULT_DAYS_OF_WEEK)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const unique = [...new Set(parts)].sort((a, b) => Number(a) - Number(b));
  return unique.length ? unique.join(',') : DEFAULT_DAYS_OF_WEEK;
};

const daysCsvToSelected = (csv) => {
  const set = new Set(normalizeDaysCsv(csv).split(','));
  return WEEKDAY_LABELS.map((_, index) => set.has(String(index)));
};

const selectedToDaysCsv = (selected) => {
  const days = WEEKDAY_LABELS.map((_, index) => index).filter((index) => selected[index]);
  return days.length ? days.join(',') : DEFAULT_DAYS_OF_WEEK;
};

function WeekdayPicker({ value, onChange, disabled, ariaLabel }) {
  const selected = daysCsvToSelected(value);

  const toggleDay = (dayIndex) => {
    if (disabled) return;
    const next = selected.map((active, i) => (i === dayIndex ? !active : active));
    if (!next.some(Boolean)) return;
    onChange(selectedToDaysCsv(next));
  };

  return (
    <div className="alerts-weekday-picker" role="group" aria-label={ariaLabel}>
      {WEEKDAY_LABELS.map((label, dayIndex) => (
        <button
          key={label}
          type="button"
          className={`alerts-weekday-chip${selected[dayIndex] ? ' is-active' : ''}`}
          aria-pressed={selected[dayIndex]}
          disabled={disabled}
          onClick={() => toggleDay(dayIndex)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const THRESHOLD_OPERATORS = [
  { value: 'lte', label: 'Drops to / below (≤)' },
  { value: 'gte', label: 'Rises to / above (≥)' },
];

const formatThresholdLabel = (threshold) => {
  const symbol = threshold.operator === 'gte' ? '≥' : '≤';
  return `${symbol} ${threshold.value}%`;
};

const limitThresholds = (thresholds) => {
  const seen = new Set();
  const next = [];
  thresholds.forEach((entry) => {
    if (entry.operator !== 'lte' && entry.operator !== 'gte') return;
    if (seen.has(entry.operator)) return;
    seen.add(entry.operator);
    next.push({ operator: entry.operator, value: entry.value });
  });
  return next;
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

const buildScheduleTimePayload = (scheduleTimes, daysOfWeek) => {
  const days = normalizeDaysCsv(daysOfWeek);
  return scheduleTimes.slice(0, MAX_SCHEDULE_TIMES).map(({ time }) => {
    const entry = { time };
    if (days !== DEFAULT_DAYS_OF_WEEK) {
      entry.days_of_week = days;
    }
    return entry;
  });
};

const buildThresholdPayload = (thresholds) =>
  limitThresholds(thresholds).map(({ operator, value }) => ({
    operator,
    value: Number(value),
  }));

const withNormalizedAlertData = (data, days) => {
  const dataPayload = { ...data };
  dataPayload.daily_energy_usage_days = normalizeDaysCsv(days);
  const t = dataPayload.solar_capacity_utilization_threshold_pct;
  if (t === '' || t === null || t === undefined || Number.isNaN(Number(t))) {
    dataPayload.solar_capacity_utilization_threshold_pct = 90;
  } else {
    dataPayload.solar_capacity_utilization_threshold_pct = Math.min(
      90,
      Math.max(0, Number(t))
    );
  }
  return dataPayload;
};

const composeAlertPayload = ({
  data,
  generator_data,
  days,
  scheduleTimes,
  thresholds,
  hasBattery,
}) => {
  const dataPayload = withNormalizedAlertData(data, days);
  const payload = {
    data: dataPayload,
    generator_data: generator_data || [],
  };
  if (hasBattery) {
    const emailEnabled = Boolean(dataPayload.daily_battery_soc_alerts);
    payload.battery_soc_config = {
      is_enabled: emailEnabled,
      push_enabled: false,
      email_enabled: emailEnabled,
      schedule_times: buildScheduleTimePayload(scheduleTimes || [], days),
      thresholds: buildThresholdPayload(thresholds || []),
    };
  }
  return payload;
};

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

function AlertSwitch({ id, name, control, checked, onChecked, disabled, label }) {
  const isOn = Boolean(checked);

  return (
    <Controller
      name={name}
      defaultValue={isOn}
      control={control}
      render={({ field }) => (
        <Switch
          id={id}
          type="button"
          checked={isOn}
          disabled={disabled}
          aria-label={label}
          className="alerts-page-switch"
          onClick={(_checked, event) => event?.preventDefault?.()}
          onChange={(next) => {
            field.onChange(next);
            onChecked(next);
          }}
        />
      )}
    />
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <section className="alerts-page-section">
      <header className="alerts-page-section-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="alerts-page-card">{children}</div>
    </section>
  );
}

function SettingRow({ rowId, switchId, title, detail, line, notice, control, children }) {
  const className = `alerts-page-row${notice ? ' alerts-page-row--notice' : ''}`;

  return (
    <div id={rowId} className={className}>
      <div className={`alerts-page-row-head${line && !detail ? ' is-inline' : ''}`}>
        <div className="alerts-page-row-copy">
          {line ? (
            <div className="alerts-page-sentence">{line}</div>
          ) : switchId ? (
            <label htmlFor={switchId} className="alerts-page-row-title">
              {title}
            </label>
          ) : (
            <h3 className="alerts-page-row-title">{title}</h3>
          )}
          {detail ? <p>{detail}</p> : null}
        </div>
        {control ? <div className="alerts-page-row-control">{control}</div> : null}
      </div>
      {children ? <div className="alerts-page-row-body">{children}</div> : null}
    </div>
  );
}

function LimitField({ id, label, unit, name, value, onChange, onKeyDown, inputRef, placeholder, short }) {
  return (
    <label className="alerts-page-field" htmlFor={id}>
      <span className="alerts-page-field-label">{label}</span>
      <span className="alerts-page-field-control">
        <input
          className={`alerts-page-input${short ? ' alerts-page-input--short' : ''}`}
          type="text"
          inputMode="decimal"
          name={name}
          id={id}
          placeholder={placeholder ?? ''}
          value={value ?? ''}
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
        {unit ? <span className="alerts-page-unit">{unit}</span> : null}
      </span>
    </label>
  );
}

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
  const [dailyEnergyUsageDays, setDailyEnergyUsageDays] = useState(DEFAULT_DAYS_OF_WEEK);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savedRef = useRef({
    data: {},
    generator_data: [],
    days: DEFAULT_DAYS_OF_WEEK,
    scheduleTimes: [],
    thresholds: [],
    hasBattery: false,
    hydrated: false,
  });
  const toggleQueue = useRef(Promise.resolve());
  const toggleEpoch = useRef({});
  const toolbarRef = useRef(null);
  const [toolbarStuck, setToolbarStuck] = useState(false);
  const isOperator = userData.role_text === "OPERATOR";
  const isSolarOnlyCustomer = getUserProductAccess(userData).isSolarOnly;
  const fetchAlertsDataLoading = alertsAndAlarms?.fetchAlertsDataLoading ?? false;
  const isFormBusy = fetchAlertsDataLoading || isSubmitting;

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: preloadedAlertsFormData,
  });

  useEffect(() => {
    getAlertAndAlarm();
  }, [getAlertAndAlarm]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      setToolbarStuck(toolbar.getBoundingClientRect().top <= 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isOperator]);

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
      const days = normalizeDaysCsv(raw.daily_energy_usage_days);
      const schedule = socConfig
        ? (socConfig.schedule_times || [])
            .slice(0, MAX_SCHEDULE_TIMES)
            .map(({ time }) => ({ time }))
        : [];
      const thresholdList = socConfig ? limitThresholds(socConfig.thresholds || []) : [];
      savedRef.current = {
        data: { ...data },
        generator_data: genData,
        days,
        scheduleTimes: schedule.map((entry) => ({ ...entry })),
        thresholds: thresholdList.map((entry) => ({ ...entry })),
        hasBattery: socConfig != null,
        hydrated: true,
      };
      setPreloadedAlertsFormData(data);
      setDailyEnergyUsageDays(days);
      setGenerator_data(genData);
      setBatterySocConfig(socConfig);
      setScheduleTimes(schedule);
      setThresholds(thresholdList);
      setScheduleTimeError('');
      setThresholdError('');
    }
  }, [alertsAndAlarms?.alertsData]);

  const openNotification = (type, title, desc) => {
    notification[type]({
      message: `${title}`,
      description: `${desc}`,
      duration: 6
    });
  };

  const formatIntInputs = (e) => {
    const convertdataToInt = parseFloat(e.target.value);
    const value = isNaN(convertdataToInt) ? '' : convertdataToInt;
    return value;
  };

  const showBatterySocBlock = batterySocConfig != null;
  const socEmailEnabled = Boolean(
    preloadedAlertsFormData?.daily_battery_soc_alerts ?? batterySocConfig?.email_enabled
  );
  const usedThresholdOperators = new Set(thresholds.map((entry) => entry.operator));
  const availableThresholdOperators = THRESHOLD_OPERATORS.filter(
    (option) => !usedThresholdOperators.has(option.value)
  );
  const selectedThresholdOperator = availableThresholdOperators.some(
    (option) => option.value === pendingThresholdOperator
  )
    ? pendingThresholdOperator
    : availableThresholdOperators[0]?.value;

  const syncBatteryEmail = (checked) => {
    setBatterySocConfig((prev) => (
      prev ? { ...prev, email_enabled: checked, is_enabled: checked } : prev
    ));
  };

  const persistToggle = (key, checked) => {
    if (!savedRef.current.hydrated) return;
    toggleEpoch.current[key] = (toggleEpoch.current[key] || 0) + 1;
    const epoch = toggleEpoch.current[key];
    setPreloadedAlertsFormData((prev) => ({ ...prev, [key]: checked }));
    if (key === 'daily_battery_soc_alerts') syncBatteryEmail(checked);

    toggleQueue.current = toggleQueue.current
      .catch(() => {})
      .then(async () => {
        const request = await setAlertAndAlarm(composeAlertPayload({
          ...savedRef.current,
          data: { ...savedRef.current.data, [key]: checked },
        }));
        if (request.fullfilled) {
          savedRef.current = {
            ...savedRef.current,
            data: { ...savedRef.current.data, [key]: checked },
          };
          return;
        }
        if (toggleEpoch.current[key] === epoch) {
          const reverted = savedRef.current.data[key];
          setPreloadedAlertsFormData((prev) => ({ ...prev, [key]: reverted }));
          if (key === 'daily_battery_soc_alerts') syncBatteryEmail(reverted);
          openNotification('error', 'Error', formatApiError(request.message));
        }
      });
  };

  const bindToggle = (key) => (checked) => {
    persistToggle(key, checked);
  };

  const handleNumberChange = (key) => (e) => {
    const val = formatIntInputs(e);
    preloadedAlertsFormData[key] = val;
    setPreloadedAlertsFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSolarCapacityChange = (e) => {
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
  };

  const handleBatterySocEmailToggle = (checked) => {
    persistToggle('daily_battery_soc_alerts', checked);
  };

  const handleAddScheduleTime = () => {
    if (scheduleTimes.length >= MAX_SCHEDULE_TIMES) {
      setScheduleTimeError('You can add up to two times.');
      return;
    }
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
      [...prev, { time }].sort((a, b) => a.time.localeCompare(b.time))
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
      setThresholdError('Enter a battery level percentage.');
      return;
    }
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setThresholdError('Enter a percentage from 0 to 100.');
      return;
    }
    const operator = thresholds.some((entry) => entry.operator === pendingThresholdOperator)
      ? THRESHOLD_OPERATORS.find(
          (option) => !thresholds.some((entry) => entry.operator === option.value)
        )?.value
      : pendingThresholdOperator;
    if (!operator) {
      setThresholdError('One drop and one rise is the maximum.');
      return;
    }
    setThresholds((prev) => limitThresholds([...prev, { operator, value }]));
    setPendingThresholdValue('');
    const remaining = THRESHOLD_OPERATORS.find((option) => option.value !== operator);
    if (remaining && !thresholds.some((entry) => entry.operator === remaining.value)) {
      setPendingThresholdOperator(remaining.value);
    }
    setThresholdError('');
  };

  const handleRemoveThreshold = (index) => {
    setThresholds((prev) => prev.filter((_, i) => i !== index));
    setThresholdError('');
  };

  const handleAlertsSubmit = async () => {
    if (!hasSaveableChanges) return;
    setIsSubmitting(true);
    try {
      await toggleQueue.current.catch(() => {});
      const updatedAlertsFormData = composeAlertPayload({
        data: preloadedAlertsFormData,
        generator_data,
        days: dailyEnergyUsageDays,
        scheduleTimes,
        thresholds,
        hasBattery: batterySocConfig != null,
      });
      const request = await setAlertAndAlarm(updatedAlertsFormData);
      if (request.fullfilled) {
        savedRef.current = {
          data: updatedAlertsFormData.data,
          generator_data: generator_data,
          days: normalizeDaysCsv(dailyEnergyUsageDays),
          scheduleTimes: scheduleTimes.map(({ time }) => ({ time })),
          thresholds: limitThresholds(thresholds).map((entry) => ({ ...entry })),
          hasBattery: batterySocConfig != null,
          hydrated: true,
        };
        openNotification("success", "Success", "Your changes have been updated successfully");
        getAlertAndAlarm();
      } else {
        openNotification('error', 'Error', formatApiError(request.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formData = preloadedAlertsFormData || {};
  const summary = [
    { rowId: 'alert-daily-energy', label: 'Daily energy', on: Boolean(formData.daily_energy_usage_alerts) },
    { rowId: 'alert-weekly-energy', label: 'Weekly energy', on: Boolean(formData.weekly_energy_usage_alerts) },
  ];
  if (showBatterySocBlock) {
    summary.push({ rowId: 'alert-battery', label: 'Battery level', on: socEmailEnabled });
  }
  summary.push(
    { rowId: 'alert-weather', label: 'Weather', on: Boolean(formData.daily_unfavorable_weather_alerts) },
    { rowId: 'alert-capacity', label: 'Solar capacity', on: Boolean(formData.solar_capacity_utilization_alerts) },
  );
  if (!isSolarOnlyCustomer) {
    summary.push(
      { rowId: 'alert-power-factor', label: 'Power factor', on: Boolean(formData.power_factor_alerts) },
      { rowId: 'alert-load-balance', label: 'Load balance', on: Boolean(formData.load_balance_alerts) },
      { rowId: 'alert-frequency', label: 'Frequency', on: Boolean(formData.frequency_alerts) },
      { rowId: 'alert-voltage', label: 'Voltage', on: Boolean(formData.voltage_alerts) },
      { rowId: 'alert-baseline', label: 'Baseline', on: Boolean(formData.baseline_alerts) },
      { rowId: 'alert-energy-target', label: 'Energy target', on: Boolean(formData.energy_usage_alerts) },
      { rowId: 'alert-forecast-co2', label: 'Forecast CO₂', on: Boolean(formData.emitted_co2_alerts) },
      { rowId: 'alert-co2-target', label: 'CO₂ target', on: Boolean(formData.set_co2_alerts) },
      { rowId: 'alert-generator-hours', label: 'Generator hours', on: Boolean(formData.operating_time_alerts) },
      { rowId: 'alert-load', label: 'Load', on: Boolean(formData.load_alerts) },
    );
  }
  const enabledSummary = summary.filter((item) => item.on);

  const scrollToSetting = (rowId) => {
    document.getElementById(rowId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const savedSnapshot = savedRef.current;
  const hasSaveableChanges = savedSnapshot.hydrated && (
    normalizeDaysCsv(dailyEnergyUsageDays) !== normalizeDaysCsv(savedSnapshot.days)
    || !scheduleTimesMatch(scheduleTimes, savedSnapshot.scheduleTimes)
    || !thresholdValuesMatch(thresholds, savedSnapshot.thresholds)
    || SAVED_LIMIT_KEYS.some((key) => !limitsMatch(preloadedAlertsFormData[key], savedSnapshot.data[key]))
  );

  const saveLabel = isSubmitting
    ? 'Saving...'
    : fetchAlertsDataLoading
      ? 'Loading...'
      : 'Save updates';

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {isOperator ? (
        <div className="alerts-page">
          <Spin
            spinning={isFormBusy}
            tip={fetchAlertsDataLoading ? 'Loading alerts...' : 'Saving updates...'}
          >
            <header className="alerts-page-header">
              <div>
                <h1>Alerts and Alarms</h1>
                <p className="alerts-page-lead">
                  {isSolarOnlyCustomer
                    ? 'Notifications for your solar system: energy usage, battery level, weather forecasts, and capacity utilization.'
                    : 'Configure how Wyre notifies you about anomalies, solar performance, and operational events.'}
                </p>
              </div>
            </header>
            <div
              ref={toolbarRef}
              className={`alerts-page-toolbar${toolbarStuck ? ' is-stuck' : ''}`}
            >
              <section className="alerts-page-days-card" aria-labelledby="operational-days-title">
                <h2 id="operational-days-title">Operational days</h2>
                <WeekdayPicker
                  value={dailyEnergyUsageDays}
                  onChange={setDailyEnergyUsageDays}
                  disabled={isFormBusy}
                  ariaLabel="Operational days"
                />
              </section>
              <div className="alerts-page-summary">
                {fetchAlertsDataLoading ? (
                  <p className="alerts-page-summary-empty">Loading your alerts…</p>
                ) : (
                  <>
                    <p className="alerts-page-count" aria-live="polite">
                      <span className="alerts-page-count-value">{enabledSummary.length}</span>
                      <span className="alerts-page-count-label">of {summary.length} on</span>
                    </p>
                    {enabledSummary.length > 0 ? (
                      <div className="alerts-page-chips">
                        {enabledSummary.map((item) => (
                          <button
                            key={item.rowId}
                            type="button"
                            className="alerts-page-chip"
                            onClick={() => scrollToSetting(item.rowId)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="alerts-page-summary-empty">Nothing is turned on yet.</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <form className="alerts-page-form" onSubmit={handleSubmit(handleAlertsSubmit)}>
              <fieldset className="alerts-page-fieldset" disabled={isFormBusy}>
                <SettingsSection
                  title="Energy reports"
                  description="Daily and weekly usage, sent on a fixed schedule."
                >
                  <SettingRow
                    rowId="alert-daily-energy"
                    switchId="daily-diesel-usage-checkbox"
                    title="Daily energy usage"
                    detail="Previous day’s report at 10:00 (Africa/Lagos), on your operational days."
                    active={Boolean(formData.daily_energy_usage_alerts)}
                    control={
                      <AlertSwitch
                        id="daily-diesel-usage-checkbox"
                        name="dailyDieselUsageChecked"
                        control={control}
                        checked={formData.daily_energy_usage_alerts}
                        disabled={isFormBusy}
                        label="Daily energy usage"
                        onChecked={bindToggle('daily_energy_usage_alerts')}
                      />
                    }
                  />

                  <SettingRow
                    rowId="alert-weekly-energy"
                    switchId="weekly-diesel-usage-checkbox"
                    title="Weekly energy usage"
                    detail="Sent every Monday at 10:00 (Africa/Lagos)."
                    active={Boolean(formData.weekly_energy_usage_alerts)}
                    control={
                      <AlertSwitch
                        id="weekly-diesel-usage-checkbox"
                        name="weeklyDieselUsageChecked"
                        control={control}
                        checked={formData.weekly_energy_usage_alerts}
                        disabled={isFormBusy}
                        label="Weekly energy usage"
                        onChecked={bindToggle('weekly_energy_usage_alerts')}
                      />
                    }
                  />
                </SettingsSection>

                {showBatterySocBlock ? (
                  <SettingsSection
                    title="Battery"
                    description="Status emails on a schedule, and a one-time alert when charge crosses a level you set."
                  >
                    <SettingRow
                      rowId="alert-battery"
                      switchId="solar-battery-soc-checkbox"
                      title="Battery level email"
                      detail="Up to two times a day, plus one drop and one rise. Times use 15-minute steps."
                      active={socEmailEnabled}
                      control={
                        <AlertSwitch
                          id="solar-battery-soc-checkbox"
                          name="solarBatterySocChecked"
                          control={control}
                          checked={formData.daily_battery_soc_alerts ?? batterySocConfig?.email_enabled}
                          disabled={isFormBusy}
                          label="Send battery level alerts by email"
                          onChecked={handleBatterySocEmailToggle}
                        />
                      }
                    >
                      {socEmailEnabled ? (
                        <div className="alerts-page-split">
                          <div className="alerts-page-panel">
                            <p className="alerts-page-panel-title">Scheduled updates</p>
                            <p className="alerts-page-hint">
                              Send a status at each time (Africa/Lagos), on your operational days.
                              You can add up to two times. Granularity is 15 minutes.
                            </p>
                            <div className="alerts-page-chip-list">
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
                                <span className="alerts-page-empty">No times configured yet.</span>
                              )}
                            </div>
                            {scheduleTimes.length < MAX_SCHEDULE_TIMES ? (
                              <div className="alerts-page-add-row">
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
                                  disabled={isFormBusy}
                                />
                                <button
                                  type="button"
                                  className="alerts-page-add"
                                  onClick={handleAddScheduleTime}
                                  disabled={isFormBusy}
                                >
                                  Add time
                                </button>
                              </div>
                            ) : (
                              <p className="alerts-page-hint">Two times is the maximum.</p>
                            )}
                            {scheduleTimeError ? (
                              <p className="input-error-message">{scheduleTimeError}</p>
                            ) : null}
                          </div>

                          <div className="alerts-page-panel">
                            <p className="alerts-page-panel-title">When battery charge crosses</p>
                            <p className="alerts-page-hint">
                              Alert once when the battery reaches a level you set — one drop and one rise, for example
                              drops to 30% or rises to 80%. It will not repeat until the battery level recovers by about 3%.
                            </p>
                            <div className="alerts-page-chip-list">
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
                                <span className="alerts-page-empty">No thresholds configured yet.</span>
                              )}
                            </div>
                            {availableThresholdOperators.length > 0 ? (
                              <div className="alerts-page-add-row">
                                <Select
                                  value={selectedThresholdOperator}
                                  onChange={setPendingThresholdOperator}
                                  className="alerts-page-operator"
                                  options={availableThresholdOperators}
                                  disabled={isFormBusy}
                                  aria-label="Battery level direction"
                                />
                                <input
                                  id="battery-soc-threshold"
                                  className="alerts-page-input alerts-page-input--short"
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="30"
                                  value={pendingThresholdValue}
                                  aria-label="Battery level percentage"
                                  onChange={(e) => {
                                    setPendingThresholdValue(formatIntInputs(e));
                                    setThresholdError('');
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddThreshold();
                                    }
                                  }}
                                />
                                <span className="alerts-page-unit">%</span>
                                <button
                                  type="button"
                                  className="alerts-page-add"
                                  onClick={handleAddThreshold}
                                  disabled={isFormBusy}
                                >
                                  Add threshold
                                </button>
                              </div>
                            ) : (
                              <p className="alerts-page-hint">One drop and one rise is the maximum.</p>
                            )}
                            {thresholdError ? (
                              <p className="input-error-message">{thresholdError}</p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </SettingRow>

                    {isSolarOnlyCustomer ? (
                      <SettingRow
                        rowId="alert-night-usage"
                        title="Night battery over-usage"
                        detail="Follows battery level email. When that email is on, Wyre can alert you overnight (18:00–07:00 Lagos) if load is higher than the battery can sustain until sunrise — at most once per night, by email and push."
                        active={socEmailEnabled}
                        control={
                          <span className={`alerts-page-status${socEmailEnabled ? ' is-on' : ''}`}>
                            {socEmailEnabled ? 'On with battery email' : 'Follows battery email'}
                          </span>
                        }
                      >
                        <div className={`alerts-page-callout ${socEmailEnabled ? 'is-warm' : 'is-muted'}`}>
                          {socEmailEnabled
                            ? 'Night over-usage alerts are active while battery level email is enabled.'
                            : 'Turn on battery level email above to enable night over-usage alerts.'}
                        </div>
                      </SettingRow>
                    ) : null}
                  </SettingsSection>
                ) : null}

                <SettingsSection
                  title="Site conditions"
                  description="Weather forecasts and how much of the installed solar capacity is in use."
                >
                  <SettingRow
                    rowId="alert-weather"
                    switchId="daily-unfavorable-weather-checkbox"
                    title="Unfavourable weather"
                    detail={
                      isSolarOnlyCustomer
                        ? 'Sent at 06:00 Lagos when today’s forecast is poor for solar. Email and push when enabled.'
                        : 'A daily alert when the forecast is unfavourable.'
                    }
                    active={Boolean(formData.daily_unfavorable_weather_alerts)}
                    control={
                      <AlertSwitch
                        id="daily-unfavorable-weather-checkbox"
                        name="dailyUnfavorableWeatherChecked"
                        control={control}
                        checked={formData.daily_unfavorable_weather_alerts}
                        disabled={isFormBusy}
                        label="Daily unfavourable weather alerts"
                        onChecked={bindToggle('daily_unfavorable_weather_alerts')}
                      />
                    }
                  />

                  <SettingRow
                    rowId="alert-capacity"
                    line={
                      <LimitField
                        id="solar-capacity-utilization-threshold"
                        label="When solar capacity utilization exceeds"
                        unit="% of installed capacity"
                        name="solarCapacityUtilizationThreshold"
                        value={formData.solar_capacity_utilization_threshold_pct}
                        placeholder="90"
                        onChange={handleSolarCapacityChange}
                        inputRef={register('solarCapacityUtilizationThreshold', solarCapacityRules)}
                      />
                    }
                    detail={
                      isSolarOnlyCustomer
                        ? 'Any time of day. At most one email or push per hour while utilization stays above your threshold.'
                        : null
                    }
                    active={Boolean(formData.solar_capacity_utilization_alerts)}
                    control={
                      <AlertSwitch
                        id="solar-capacity-utilization-checkbox"
                        name="solarCapacityUtilizationChecked"
                        control={control}
                        checked={formData.solar_capacity_utilization_alerts}
                        disabled={isFormBusy}
                        label="Solar capacity utilization alerts"
                        onChecked={bindToggle('solar_capacity_utilization_alerts')}
                      />
                    }
                  >
                    {errors.solarCapacityUtilizationThreshold ? (
                      <p className="input-error-message">Enter a percentage from 0 to 90</p>
                    ) : null}
                  </SettingRow>
                </SettingsSection>

                {isSolarOnlyCustomer ? (
                  <SettingsSection
                    title="Always sent"
                    description="These go out on their own. There is nothing to turn off here."
                  >
                    <SettingRow
                      rowId="alert-solar-recap"
                      notice
                      title="Daily solar generation recap"
                      detail="Every solar site with generation today receives a push and in-app message at 19:00 Lagos. This is separate from the 10:00 daily usage email."
                      control={<span className="alerts-page-badge">Always on</span>}
                    >
                      <div className="alerts-page-callout is-info">
                        No setting to change here — expect the evening app notification when your system produced
                        solar energy that day.
                      </div>
                    </SettingRow>
                    <SettingRow
                      rowId="alert-soiling"
                      notice
                      title="Solar panel soiling"
                      detail="If last week’s yield looks low compared to weather, Wyre adds a note on your Monday weekly solar report email. There is no separate push for soiling."
                      control={<span className="alerts-page-badge">Weekly email</span>}
                    >
                      <div className="alerts-page-callout is-info">
                        No toggle on this page — soiling is surfaced on the weekly report when applicable.
                      </div>
                    </SettingRow>
                  </SettingsSection>
                ) : null}

                {!isSolarOnlyCustomer ? (
                  <SettingsSection
                    title="Power quality"
                    description="Power factor, balance, frequency, and voltage."
                  >
                    <SettingRow
                      rowId="alert-power-factor"
                      line={
                        <>
                          <LimitField
                            id="high-power-factor"
                            label="Power factor exceeds"
                            name="highPowerFactor"
                            value={formData.max_power_factor}
                            placeholder={formData.max_power_factor}
                            onChange={handleNumberChange('max_power_factor')}
                            inputRef={register('highPowerFactor', numberPattern)}
                          />
                          <LimitField
                            id="low-power-factor"
                            label="or goes below"
                            name="lowPowerFactor"
                            value={formData.min_power_factor}
                            placeholder={formData.min_power_factor}
                            onChange={handleNumberChange('min_power_factor')}
                            inputRef={register('lowPowerFactor', numberPattern)}
                          />
                        </>
                      }
                      active={Boolean(formData.power_factor_alerts)}
                      control={
                        <AlertSwitch
                          id="power-factor-checkbox"
                          name="powerFactorChecked"
                          control={control}
                          checked={formData.power_factor_alerts}
                          disabled={isFormBusy}
                          label="Power factor"
                          onChecked={bindToggle('power_factor_alerts')}
                        />
                      }
                    >
                      {(errors.highPowerFactor || errors.lowPowerFactor) ? (
                        <p className="input-error-message">Power factor values must be numbers</p>
                      ) : null}
                    </SettingRow>

                    <SettingRow
                      rowId="alert-load-balance"
                      switchId="load-balance-issues-checkbox"
                      title="Load balance"
                      detail="Alert when a load imbalance is detected."
                      active={Boolean(formData.load_balance_alerts)}
                      control={
                        <AlertSwitch
                          id="load-balance-issues-checkbox"
                          name="loadBalanceIssuesChecked"
                          control={control}
                          checked={formData.load_balance_alerts}
                          disabled={isFormBusy}
                          label="Load balance issues detected"
                          onChecked={bindToggle('load_balance_alerts')}
                        />
                      }
                    />

                    <SettingRow
                      rowId="alert-frequency"
                      line={
                        <LimitField
                          id="frequency-variance-factor"
                          label="Frequency variance between threshold ±"
                          name="frequencyVariance"
                          value={formData.frequency_precision}
                          placeholder={formData.frequency_precision}
                          onChange={handleNumberChange('frequency_precision')}
                          inputRef={register('frequencyVariance', numberPattern)}
                        />
                      }
                      active={Boolean(formData.frequency_alerts)}
                      control={
                        <AlertSwitch
                          id="frequency-variance-checkbox"
                          name="frequencyVarianceChecked"
                          control={control}
                          checked={formData.frequency_alerts}
                          disabled={isFormBusy}
                          label="Frequency variance"
                          onChecked={bindToggle('frequency_alerts')}
                        />
                      }
                    >
                      {errors.frequencyVariance ? (
                        <p className="input-error-message">Frequency variance must be a number</p>
                      ) : null}
                    </SettingRow>

                    <SettingRow
                      rowId="alert-voltage"
                      line={
                        <>
                          <LimitField
                            id="high-voltage"
                            label="Voltage exceeds"
                            unit="volts"
                            name="highVoltage"
                            value={formData.max_voltage}
                            placeholder={formData.max_voltage}
                            onChange={handleNumberChange('max_voltage')}
                            inputRef={register('highVoltage', numberPattern)}
                          />
                          <LimitField
                            id="low-voltage"
                            label="or goes below"
                            unit="volts"
                            name="lowVoltage"
                            value={formData.min_voltage}
                            placeholder={formData.min_voltage}
                            onChange={handleNumberChange('min_voltage')}
                            inputRef={register('lowVoltage', numberPattern)}
                          />
                        </>
                      }
                      active={Boolean(formData.voltage_alerts)}
                      control={
                        <AlertSwitch
                          id="voltage-checkbox"
                          name="voltageChecked"
                          control={control}
                          checked={formData.voltage_alerts}
                          disabled={isFormBusy}
                          label="Voltage"
                          onChecked={bindToggle('voltage_alerts')}
                        />
                      }
                    >
                      {(errors.highVoltage || errors.lowVoltage) ? (
                        <p className="input-error-message">Voltage values must be numbers</p>
                      ) : null}
                    </SettingRow>
                  </SettingsSection>
                ) : null}

                {!isSolarOnlyCustomer ? (
                  <SettingsSection
                    title="Events and targets"
                    description="Baselines, CO₂, generator hours, and load."
                  >
                    <SettingRow
                      rowId="alert-baseline"
                      switchId="estimated-baseline-checkbox"
                      title="Forecasted baseline"
                      detail="Alert when usage reaches the forecasted baseline."
                      active={Boolean(formData.baseline_alerts)}
                      control={
                        <AlertSwitch
                          id="estimated-baseline-checkbox"
                          name="estimatedbaselineChecked"
                          control={control}
                          checked={formData.baseline_alerts}
                          disabled={isFormBusy}
                          label="When forecasted baseline is reached"
                          onChecked={bindToggle('baseline_alerts')}
                        />
                      }
                    />

                    <SettingRow
                      rowId="alert-energy-target"
                      line={
                        <LimitField
                          id="energy-usage-max"
                          label="When set energy target is reached"
                          unit="kWh"
                          name="energyUsageMax"
                          value={formData.energy_usage_max}
                          placeholder={formData.energy_usage_max}
                          onChange={handleNumberChange('energy_usage_max')}
                          inputRef={register('energyUsageMax', numberPattern)}
                        />
                      }
                      active={Boolean(formData.energy_usage_alerts)}
                      control={
                        <AlertSwitch
                          id="set-baseline-checkbox"
                          name="energyUsageChecked"
                          control={control}
                          checked={formData.energy_usage_alerts}
                          disabled={isFormBusy}
                          label="When set energy target is reached"
                          onChecked={bindToggle('energy_usage_alerts')}
                        />
                      }
                    >
                      {errors.energyUsageMax ? (
                        <p className="input-error-message">Energy target must be a number</p>
                      ) : null}
                    </SettingRow>

                    <SettingRow
                      rowId="alert-forecast-co2"
                      switchId="eliminated-co2-checkbox"
                      title={<>Forecasted CO<sub>2</sub></>}
                      detail="Alert when forecasted CO₂ is reached."
                      active={Boolean(formData.emitted_co2_alerts)}
                      control={
                        <AlertSwitch
                          id="eliminated-co2-checkbox"
                          name="eliminatedCo2Checked"
                          control={control}
                          checked={formData.emitted_co2_alerts}
                          disabled={isFormBusy}
                          label="When forecasted CO2 is reached"
                          onChecked={bindToggle('emitted_co2_alerts')}
                        />
                      }
                    />

                    <SettingRow
                      rowId="alert-co2-target"
                      line={
                        <LimitField
                          id="set-co2-value"
                          label={<>When set CO<sub>2</sub> is reached</>}
                          unit="tons"
                          name="setCo2Value"
                          value={formData.set_co2_value}
                          placeholder={formData.set_co2_value}
                          onChange={handleNumberChange('set_co2_value')}
                          inputRef={register('setCo2Value', numberPattern)}
                        />
                      }
                      active={Boolean(formData.set_co2_alerts)}
                      control={
                        <AlertSwitch
                          id="set-co2-checkbox"
                          name="setCo2Checked"
                          control={control}
                          checked={formData.set_co2_alerts}
                          disabled={isFormBusy}
                          label="When set CO2 is reached"
                          onChecked={bindToggle('set_co2_alerts')}
                        />
                      }
                    >
                      {errors.setCo2Value ? (
                        <p className="input-error-message">CO2 value must be a number</p>
                      ) : null}
                    </SettingRow>

                    <SettingRow
                      rowId="alert-generator-hours"
                      switchId="generator-on-checkbox"
                      title="Generator outside hours"
                      detail="Alert when any generator is turned on outside operating hours."
                      active={Boolean(formData.operating_time_alerts)}
                      control={
                        <AlertSwitch
                          id="generator-on-checkbox"
                          name="generatorOnChecked"
                          control={control}
                          checked={formData.operating_time_alerts}
                          disabled={isFormBusy}
                          label="When any generator is turned on outside operating hours"
                          onChecked={bindToggle('operating_time_alerts')}
                        />
                      }
                    />

                    <SettingRow
                      rowId="alert-load"
                      line={
                        <LimitField
                          id="load-excess"
                          label="When load exceeds"
                          unit="kW"
                          name="loadExcess"
                          value={formData.load_threshold_value}
                          placeholder={formData.load_threshold_value}
                          onChange={handleNumberChange('load_threshold_value')}
                          inputRef={register('loadExcess', numberPattern)}
                        />
                      }
                      active={Boolean(formData.load_alerts)}
                      control={
                        <AlertSwitch
                          id="load-excess-checkbox"
                          name="loadExcessChecked"
                          control={control}
                          checked={formData.load_alerts}
                          disabled={isFormBusy}
                          label="Load excess"
                          onChecked={bindToggle('load_alerts')}
                        />
                      }
                    >
                      {errors.loadExcess ? (
                        <p className="input-error-message">Load excess value must be a number</p>
                      ) : null}
                    </SettingRow>
                  </SettingsSection>
                ) : null}
              </fieldset>

              <div className="alerts-page-savebar">
                <p className="alerts-page-save-copy">
                  Days, times, and limits apply after you save.
                </p>
                <button
                  type="submit"
                  className="alerts-page-save"
                  disabled={isFormBusy || !hasSaveableChanges}
                >
                  {saveLabel}
                </button>
              </div>
            </form>
          </Spin>
        </div>
      ) : (
        <UnAuthorizeResponse />
      )}
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
