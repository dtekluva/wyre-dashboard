

export const devicesArray = (activeBranch, checkedBranchId, checkedDevicesId) =>{
  let activeDevices = activeBranch.devices;
  if(checkedDevicesId.length > 0){
    activeDevices = activeBranch.devices.filter(function(item){
      return checkedDevicesId.includes(item.device_id);
    });
  }
  return {...activeBranch, devices: activeDevices};
}

export const formatToAmPm = (time) => {
  const date = new Date(`1970-01-01T${time}:00`);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const isReportReadyToSend = (context) => {
  if (!context) return false;

  switch (context.report_type) {
    case "daily":
      return Boolean(context.branch_id && context.date);

    case "periodic":
      return Boolean(
        context.branch_id &&
        context.start_date &&
        context.end_date
      );

    case "monthly":
      return Boolean(
        context.branch_id &&
        context.month &&
        context.year
      );

    default:
      return false;
  }
};

// export const branchesArray = (branches, checkedBranchId) =>{
//   let activeBranches = checkedBranchId.length > 0? branches.filter(function(item){
//     return checkedBranchId.includes(item.branch_id);
//   }) : branches;
//   return activeBranches;
// }