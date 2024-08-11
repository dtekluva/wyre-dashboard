

export const devicesArray = (branches, checkedBranchId, checkedDevicesId) =>{
  let activeBranch = checkedBranchId? branches.find((branch) => branch.branch_id = checkedBranchId) : branches[0];
  console.log('activeBranch is the checked branch id',activeBranch)
  if(checkedDevicesId.length > 0){
    let activeDevices = activeBranch.devices.filter(function(item){
      return checkedDevicesId.includes(item.device_id);
    });
    activeBranch.devices = activeDevices;
  }

  console.log('this is the activeBranchactiveBranchactiveBranch', activeBranch)
  return activeBranch;
}

