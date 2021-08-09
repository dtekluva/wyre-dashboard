import React, { useContext } from 'react';

import PdfIcon from '../icons/PdfIcon';
import PrintIcon from '../icons/PrintIcon';

import CompleteDataContext from '../Context';
import dataHttpServices from '../services/devices';
import { notification, Tooltip } from 'antd';
import dayjs from 'dayjs';

import axios from 'axios';

import { ScheduleEmailModal } from '../components/ScheduleEmailModal';

function PrintButtons() {
  const { token, userId, allDevices, checkedDevices,userDateRange,selectedDateRange, organization } = useContext(
    CompleteDataContext
  );

  let dateRange = userDateRange === null || userDateRange.length === 0 ? dataHttpServices.endpointDateRange
    : dataHttpServices.convertDateRangeToEndpointFormat(userDateRange);

  const datepicked = dateRange.split(' ');
  let defaultStartDate = datepicked[0]
  let endArr = datepicked[1].split("/");
  const endDateArray = endArr[1];  

  const getBranchesName =  organization.branches && organization.branches.map((data)=>{
      return data.name
  })

  const openNotification = () => {
    notification.info({
      message: 'PDF Download',
      description:
        'Your file download will begin soon.',
      duration: 5,
    });
  };

  const PdfDownloadLink = async () => {
    openNotification()
    const staticUrl = `https://wyreng.xyz/api/v1/report_download/${userId}/${dateRange}/`;
    let selectedDevicesIds = [];

    for (const prop in checkedDevices) {
      let listOfDeviceId = allDevices.filter((e) => {
        return e.name === prop;
      });
      selectedDevicesIds.push(listOfDeviceId[0].id);
    }

    if (selectedDevicesIds.length === 0 ) {
        allDevices.filter((e)=>{
          return selectedDevicesIds.push(e.id)
        })
    }
    const data = JSON.stringify({ selected_devices: selectedDevicesIds})
    const response = axios
      .post(staticUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${getBranchesName} Billing for ${defaultStartDate}-${endDateArray}.pdf`);
        document.body.appendChild(link);
        link.click();
        return res.data;
      })
      .catch((error) => console.log('Error downloading report:', error));

    return response;
  };

  const modal = <ScheduleEmailModal />;

  return (
    <ul className="print-buttons h-hidden-medium-down">
      <Tooltip title="Schedule an e-mail containing your billing info.">
      <li className="print-button-container">
        <button type="button" className="print-button">
          {modal}
        </button>
      </li>
      </Tooltip>
      <Tooltip title="Download a PDF file containing your billing data.">
      <li className="print-button-container">
        <button
          onClick={PdfDownloadLink}
          className="print-button"
          type="button"
        >
          <PdfIcon />
        </button>
      </li>
      </Tooltip>
      <li className="print-button-container">
        <button type="button" className="print-button" style={{cursor:"not-allowed"}}>
          <PrintIcon />
        </button>
      </li>
    </ul>
  );
}

export default PrintButtons;
