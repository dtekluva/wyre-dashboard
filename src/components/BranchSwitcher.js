import { useEffect, useState } from 'react';
import { Button, Dropdown, Menu, message, Select, Spin, Tooltip } from 'antd';
import { ApartmentOutlined, SwapOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, connect } from 'react-redux';
import { getPermittedBranches, switchBranch } from '../redux/actions/auth/auth.action';

const { Option } = Select;

const BranchSwitcher = ({ switchBranch, currentBranchId, onBranchChange, style }) => {
  const dispatch = useDispatch();
  const [selectedBranch, setSelectedBranch] = useState(currentBranchId);
  const [sssselectedBranch, setSssselectedBranch] = useState(null);

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
    if (switchedNewBranch) {
      window.localStorage.setItem('loggedWyreUser', JSON.stringify(switchedNewBranch.data.token));
      window.location.reload();
      // onBranchChange(switchedNewBranch);
    }
  }, [switchedNewBranch]);

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

  const handleMenuClick = ({ key }) => {
    const branch = permittedBranches.branches.find(b =>  String(b.id) === key);
    
    // setSssselectedBranch(branch.name);
    // // 🔄 Call your login/switch branch logic here
    // switchBranch(branch.id)
    // message.success(`Switched to ${branch.name}`);
    // loginToBranch(branch.key) // <-- your real logic
    if (branch) {
      message.success(`Switching to: ${branch.name}`);
      switchBranch(branch.id)
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      {permittedBranches.branches.map(branch => (
        <Menu.Item key={branch.id}>{branch.name}</Menu.Item>
      ))}
    </Menu>
  );

  // const menu = (
  //   <Menu onClick={handleMenuClick}>
  //     {permittedBranches.branches.map((branch, index )=> (
  //       <Menu.Item key={String(branch.id) + index}>{branch.name}</Menu.Item>
  //     ))}
  //   </Menu>
  // );

  return (
    <>
      {/* <Select
        value={selectedBranch}
        style={{
          width: 140,
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
      </Select> */}

      {/* <Dropdown overlay={menu} trigger={['click']}>
        <Button type="default">
          {sssselectedBranch || 'Select Branch'}
        </Button>
      </Dropdown> */}

      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
      >
        <Tooltip title='Switch Branch'>
          <SwapOutlined
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: '#444',
          }}
        />
        </Tooltip>
      </Dropdown>
    </>
  );
};

const mapDispatchToProps = {
  getPermittedBranches,
  switchBranch
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, mapDispatchToProps)(BranchSwitcher);