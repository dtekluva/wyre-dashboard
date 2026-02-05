import { useEffect, useContext, useState } from 'react';

import { connect } from 'react-redux';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import BillingConsumptionKwhBarChart from '../components/barCharts/BillingConsumptionKwhBarChart';
import BillingConsumptionNairaBarChart from '../components/barCharts/BillingConsumptionNairaBarChart';
import Loader from '../components/Loader';

import PrintButtons from '../smallComponents/PrintButtons';
import ThinArrowRight from '../icons/ThinArrowRight';

import { formatParametersDatetimes } from '../helpers/genericHelpers';
import { getBillingRefinedOrganizationData, getBillingRefinedOrganizationDataWithChekBox } from '../helpers/organizationDataHelpers';

import { fetchBillingData } from '../redux/actions/billing/billing.action';
import { getBillingRenderedData } from '../helpers/renderedDataHelpers';
import { isEmpty } from "../helpers/authHelper";

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Billing', id: 2 },
];

function Billing({ match, fetchBillingData: fetchBillingDataFunc, billing }) {
  const {
    setCurrentUrl,
    checkedItems,
    checkedDevices,
    checkedBranches,
    userDateRange
  } = useContext(CompleteDataContext);

  const [refindedBilling, setRefinedBilling] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);
  
  // useEffect(() => {
  //   fetchBillingDataFunc(userDateRange);
  // }, []);

  useEffect(() => {
    if (!pageLoaded && isEmpty(billing.billingData || {})) {
      fetchBillingDataFunc(userDateRange);
      // fetch the power factors here
    }

    if (!isEmpty(billing.billingData) > 0 && pageLoaded) {
      fetchBillingDataFunc(userDateRange);
      // fetch the power factors here
    }
    setPageLoaded(true);
  }, [userDateRange]);




    // Feed authenticated data into application
    useEffect(() => {
      // Ensure organization object is not empty
      if (
        Object.keys(billing.billingData).length > 0 &&
        billing.constructor === Object
      ) {
        // make a copy of the data
        const copyOrganisation = JSON.parse(JSON.stringify(billing.billingData));
        // If nothing is checked, render organization's data
        // Otherwise, render data from checked items
        if (
          Object.keys(checkedItems).length === 0 &&
          checkedItems.constructor === Object
        ) {

          const refindedData = getBillingRefinedOrganizationData(copyOrganisation);
          setRefinedBilling(refindedData);
  
        } 
        else {
  
          const dataWithCheckBoxes = getBillingRefinedOrganizationDataWithChekBox({
            checkedBranches, checkedDevices, organization: copyOrganisation, setRenderedDataObjects: setRefinedBilling
          });
          const renderedDataArray = Object.values(dataWithCheckBoxes?.branchAndDevice);
          setRefinedBilling(getBillingRenderedData(renderedDataArray));
        }
      }
    }, [checkedItems, billing.billingData]);

    const {
      billing_consumption_kwh,
      billing_consumption_naira,
      overall_billing_totals,
      devices_previous_billing_total,
      devices_present_billing_total,
    } = refindedBilling;
  
  
  const { present_total, previous_total, usage } =
    overall_billing_totals || {};

  const devicePreviousBillsRows =
    devices_previous_billing_total &&
    devices_previous_billing_total.map((eachDevice) => {
      return (
        <tr key={eachDevice.deviceName}>
          <td>
            <span>{eachDevice.deviceName}</span>
            {/* —
            <span>
              {(metrics && metrics.ipp_per_kwh.toFixed(2).toLocaleString()) ||
                0}
            </span> */}
            —<span>{eachDevice.usage_kwh.toLocaleString()}kWh</span>
            <ThinArrowRight />
            <span>₦{eachDevice.value_naira.toLocaleString()}</span>
          </td>
        </tr>
      );
    });
  const devicePresentBillsRows =
    devices_present_billing_total &&
    devices_present_billing_total.map((eachDevice) => {
      return (
        <tr key={eachDevice.deviceName}>
          <td>
            <span>{eachDevice.deviceName}</span>
            {/* —
            <span>
              {(metrics && metrics.ipp_per_kwh.toFixed(2).toLocaleString()) ||
                0}
            </span> */}
            —<span>{eachDevice.usage_kwh.toLocaleString()}kWh</span>
            <ThinArrowRight />
            <span>₦{eachDevice.value_naira.toLocaleString()}</span>
          </td>
        </tr>
      );
    });

  const chartConsumptionKwhValues =
    billing_consumption_kwh &&
    billing_consumption_kwh.map((eachDevice) => eachDevice.values);
  const chartConsumptionKwhDates =
    billing_consumption_kwh &&
    formatParametersDatetimes(billing_consumption_kwh[0].dates);
  const allDeviceNames =
    billing_consumption_kwh &&
    billing_consumption_kwh.map((eachDevice) => eachDevice.deviceName);

  const chartConsumptionNairaDates =
    billing_consumption_naira &&
    formatParametersDatetimes(billing_consumption_naira.dates);
  const chartConsumptionNairaValues =
    billing_consumption_naira && billing_consumption_naira.values;

  if (billing.fetchBillingLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
        <PrintButtons />
      </div>
      <div className='billing-bill-tables'>
        <div className='billing-bill-table-container'>
          <table className='billing-table billing-bill-table'>
            <caption className='billing-table-caption h-caption-up'>
              Previous Bill
            </caption>
            <tbody>
              <tr
                className={
                  present_total && previous_total.usage_kwh > 0
                    ? 'billing-bill-table__first-row'
                    : 'billing-bill-table__first-row h-hide'
                }
              >
                <td>
                  <span>
                    {previous_total &&
                      previous_total.usage_kwh.toLocaleString()}
                    kWh
                  </span>
                  <ThinArrowRight />
                  <span>
                    ₦
                    {previous_total &&
                      previous_total.value_naira.toLocaleString()}
                  </span>
                </td>
              </tr>
              {devicePreviousBillsRows}
            </tbody>
          </table>
        </div>

        <div className='billing-bill-table-container'>
          <table className='billing-table billing-bill-table'>
            <caption className='billing-table-caption h-caption-up'>
              Present Bill
            </caption>
            <tbody>
              <tr
                className={
                  present_total && present_total.usage_kwh > 0
                    ? 'billing-bill-table__first-row'
                    : 'billing-bill-table__first-row h-hide'
                }
              >
                <td>
                  <span>
                    {present_total && present_total.usage_kwh.toLocaleString()}
                    kWh
                  </span>
                  <ThinArrowRight />
                  <span>
                    ₦
                    {present_total &&
                      present_total.value_naira.toLocaleString()}
                  </span>
                </td>
              </tr>
              {devicePresentBillsRows}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={
          usage && usage.previous_kwh > 0
            ? 'usage-and-metrics-tables'
            : 'usage-and-metrics-tables h-hide'
        }
      >
        <table className='billing-table billing-metrics-table'>
          <tbody>
            {/* <tr>
              <td>
                <span className='metric-name'>Utility:</span>{' '}
                ₦{(metrics && metrics.utility_per_kwh.toFixed(2).toLocaleString())|| 0}/kWh
              </td>
            </tr>
            <tr>
              <td>
                <span className='metric-name'>IPP:</span>{' '}
                ₦{(metrics && metrics.ipp_per_kwh.toFixed(2).toLocaleString()) || 0}/kWh
              </td>
            </tr>
            <tr>
              <td>
                <span className='metric-name'>Generator:</span>{' '}
                ₦{(metrics && metrics.diesel_per_kwh.toFixed(2).toLocaleString()) || 0}/kWh
              </td>
            </tr>
            <tr>
              <td>
                <span className='metric-name'>Blended Cost of Energy:</span>
                ₦{(metrics && metrics.blended_cost_per_kwh.toFixed(2).toLocaleString()) || 0}
                /kWh
              </td>
            </tr> */}
          </tbody>
          <tfoot>
            <tr>
              <td>
                {present_total && present_total.usage_kwh > 0
                  ? `Total Amount Payable
              this Month: ₦${present_total.value_naira.toLocaleString()}`
                  : 'Check Present Bill Table for Total Amount Payable'}
              </td>
            </tr>
          </tfoot>
        </table>

        <div hidden className='billing-usage-table-container'>
          <table className='billing-table billing-usage-table'>
            <caption className='billing-table-caption h-caption-up'>
              Usage
            </caption>
            <thead>
              <tr>
                <th scope='col'>Previous Usage (kWh)</th>
                <th scope='col'>Present Usage (kWh)</th>
                <th scope='col'>Total Usage (kWh)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{usage && usage.previous_kwh.toLocaleString()}kWh</td>
                <td>{usage && usage.present_kwh.toLocaleString()}kWh</td>
                <td>{usage && usage.total_usage_kwh.toLocaleString()}kWh</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <article className='billing-bar-container'>
        <BillingConsumptionKwhBarChart
          chartConsumptionValues={chartConsumptionKwhValues}
          chartDeviceNames={allDeviceNames}
          chartDates={chartConsumptionKwhDates}
        />
      </article>

      <article className='billing-bar-container h-mt'>
        <BillingConsumptionNairaBarChart
          chartValues={chartConsumptionNairaValues}
          chartDates={chartConsumptionNairaDates}
        />
      </article>


    </>
  );
}

const mapDispatchToProps= {
  fetchBillingData
}

const mapStateToProps =(state) => ({
 billing: state.billing
})

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
