import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';

const BillingToCSVBtn = () => {
  const [billingData, setBillingData] = useState([]);
  const url = 'http://localhost:3001/authenticatedData'
  const csvLinkEl = useRef();

  // const getBillingData = () => {
      useEffect(() => {
        fetch(url)
          .then(function (res) {
            return res.json();
          })
          .then((data) => {
            setBillingData(data.toString());
          });
          setTimeout(() => {
            csvLinkEl.current.link.click();
          });
      }, [url]);
    // }


  const headers = [
    {label:'Previous Total Usage KWH', key:'branches.devices.billing.totals.previous_total.usage_kwh'},
    
    {label:'Previous Total Usage in Naira', key:'branches.devices.billing.totals.previous_total.value_naira'},
    {label:'Present total usage KWH', key:'branches.devices.billing.totals.present_total.usage_kwh'}
  ]    

  return (
    <div>
      {/* <button onClick={getBillingData}>Export to CSV</button> */}
      {billingData != null ? <CSVLink data={billingData} header={headers}  filename="BillingData.csv" ref={csvLinkEl} target="_blank">Export</CSVLink> : null}
      </div>
  );
};

// class BillingToCSVBtn extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//     };

//     this.csvLinkEl = React.createRef();
//     this.headers = [
//       {
//         label: 'Previous_total_Usage_kwh',
//         key: 'branches.devices.billing.totals["previous_total"].usage_kwh',
//       },
//       {
//         label: 'Previous_total_Value_naira',
//         key: 'branches.devices.billing.totals["previous_total"].value_naira',
//       },
//       {
//         label: 'Present_total_Usage_kwh',
//         key: 'branches.devices.billing.totals.present_total.usage_kwh',
//       },
//       {
//         label: 'Present_total_Value_naira',
//         key: 'devices.billing.totals.present_total.value_naira',
//       },
//       {
//         label: 'Consumption_kwh_Dates',
//         key: 'devices.billing.consumption_kwh.dates',
//       },
//       {
//         label: 'Consumption_kwh_Values',
//         key: 'devices.billing.consumption_kwh.values',
//       },
//       {
//         label: 'Consumption_Naira_Dates',
//         key: 'devices.billing.consumption_naira.dates',
//       },
//       {
//         label: 'Consumption_Naira_Values',
//         key: 'devices.billing.consumption_naira.values',
//       },
//     ];
//   }

//   getBillingData = async () => {
//     const res = await fetch('http://localhost:3001/authenticatedData')
//     return await res.json();
//   };

//   downloadBillingData = async () => {
//     const data = this.getBillingData;
//     this.setState({ data: data.toString() }, () => {
//       setTimeout(() => {
//         this.csvLinkEl.current.link.click();
//       });
//     });
//   };

//   render() {
//     const {data} = this.state;

//     return (
//       <div>
//         <button
//           onClick={this.downloadBillingData}
//           className="btn btn-primary"
//         >
//           Export to CSV
//         </button>
//         <CSVLink
//           // headers={this.headers}
//           data={this.state.data}
//           filename="Billing_data.csv"
//           className="btn btn-primary"
//           ref={this.csvLinkEl}
//         />
//       </div>
//     );
//   }
// }





export default BillingToCSVBtn;
