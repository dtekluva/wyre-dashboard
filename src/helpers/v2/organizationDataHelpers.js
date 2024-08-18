

export const devicesArray = (branches, checkedBranchId, checkedDevicesId) =>{

  let activeBranch = checkedBranchId? branches.find((branch) => branch.branch_id = checkedBranchId) : branches? branches[0] : {};

  if(checkedDevicesId.length > 0){
    let activeDevices = activeBranch.devices.filter(function(item){
      return checkedDevicesId.includes(item.device_id);
    });
    activeBranch.devices = activeDevices;
  }

  return activeBranch;
}

