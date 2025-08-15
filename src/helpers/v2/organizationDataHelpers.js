

export const devicesArray = (activeBranch, checkedBranchId, checkedDevicesId) =>{
  let activeDevices = activeBranch.devices;
  if(checkedDevicesId.length > 0){
    activeDevices = activeBranch.devices.filter(function(item){
      return checkedDevicesId.includes(item.device_id);
    });
  }
  return {...activeBranch, devices: activeDevices};
}

// export const branchesArray = (branches, checkedBranchId) =>{
//   let activeBranches = checkedBranchId.length > 0? branches.filter(function(item){
//     return checkedBranchId.includes(item.branch_id);
//   }) : branches;
//   return activeBranches;
// }