import { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getPermittedBranches, switchBranch } from '../redux/actions/auth/auth.action';

const { Option } = Select;

const BranchSwitcher = ({ currentBranchId, onBranchChange, style }) => {
  const dispatch = useDispatch();
  const [selectedBranch, setSelectedBranch] = useState(currentBranchId);

  // Get auth state from Redux
  const {
    permittedBranches,
    fetchPermittedBranchesLoading,
    switchNewBranchLoading,
    switchedNewBranch
  } = useSelector((state) => state.auth);
  console.log('permittedBranches---------> ', permittedBranches);
  console.log('switchedNewBranch---------> ', switchedNewBranch);
  console.log('currentBranchId---------> ', currentBranchId);
  

  // Fetch permitted branches on component mount
  useEffect(() => {
    // Check if user is authenticated and branches haven't been fetched yet
    const loggedUserJSON = localStorage.getItem('loggedWyreUser');
    if (loggedUserJSON && permittedBranches === false && !fetchPermittedBranchesLoading) {
      console.log('Fetching permitted branches...');
      dispatch(getPermittedBranches());
    }
  }, [dispatch]);

  // Update selected branch when currentBranchId changes
  useEffect(() => {
    if (currentBranchId) {
      setSelectedBranch(currentBranchId);
    }
  }, [currentBranchId]);

  // Handle successful branch switch
  useEffect(() => {
    if (switchedNewBranch && onBranchChange) {
      onBranchChange(switchedNewBranch);
    }
  }, [switchedNewBranch, onBranchChange]);

  const handleChange = (value) => {
    setSelectedBranch(value);
    dispatch(switchBranch(value));
  };

  // Show loading spinner while fetching branches
  if (fetchPermittedBranchesLoading) {
    return <Spin size="small" />;
  }

  // Don't render if no branches available
  if (!permittedBranches || !Array.isArray(permittedBranches.branches) || permittedBranches.branches.length === 0) {
    return null;
  }

  return (
    <Select
      value={selectedBranch}
      style={{
        width: 200,
        ...style,
      }}
      className="rounded-select"
      onChange={handleChange}
      dropdownMatchSelectWidth={false}
      placeholder="Select Branch"
      loading={switchNewBranchLoading}
      disabled={switchNewBranchLoading}
    >
      {permittedBranches.branches.map((branch) => (
        <Option key={branch.id} value={branch.id}>
          {branch.name}
        </Option>
      ))}
    </Select>
  );
};

export default BranchSwitcher;