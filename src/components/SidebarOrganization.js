import React, { useState, useContext } from 'react';

import SidebarBranch from '../components/SidebarBranch';

import PlusIcon from '../icons/PlusIcon';
import MinusIcon from '../icons/MinusIcon';

import CompleteDataContext from '../Context';

function SidebarOrganization({ orgData }) {
  const [isOpen, setIsOpen] = useState(false);
  const { allDevices } = useContext(
    CompleteDataContext
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const Icon = isOpen ? <MinusIcon /> : <PlusIcon />;

  const branchComponents =
    orgData.branches && isOpen
      ? orgData.branches.map((eachBranch) => {
          return <SidebarBranch branchData={eachBranch} key={eachBranch.name} />;
        }): '';
        // allDevices.length =0
  
        orgData.branches && orgData.branches.forEach((branch)=> {
        branch.devices.forEach((device)=>{
        allDevices.push({"name": device.name, "id":device.device_id})
        })
      })
  return (
    <li className="sidebar-org">
      <div className="sidebar-org__details">
        <span>{orgData.name}</span>
        {orgData.branches && (
          <button
            type="button"
            className="sidebar-org__button"
            onClick={handleToggle}
          >
            {Icon}
          </button>
        )}
      </div>

      <ul className="sidebar-org__branches">{branchComponents}</ul>
    </li>
  );
}

export default SidebarOrganization;
