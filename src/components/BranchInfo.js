import { useEffect, useState } from 'react';
import { Card, Typography, Tag, Spin, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getPermittedBranches } from '../redux/actions/auth/auth.action';

const { Title, Text } = Typography;

const BranchInfo = () => {
  const dispatch = useDispatch();
  const [currentBranch, setCurrentBranch] = useState(null);
  

  // Get auth state from Redux
  const {
    permittedBranches,
    fetchPermittedBranchesLoading,
    switchNewBranchLoading,
    switchedNewBranch
  } = useSelector((state) => state.auth);
  console.log('switchedNewBranch---------> ', switchedNewBranch);
  console.log('currentBranch---------', currentBranch);

  // Fetch permitted branches on component mount
  useEffect(() => {
    // Check if user is authenticated and branches haven't been fetched yet
    const loggedUserJSON = localStorage.getItem('loggedWyreUser');
    if (loggedUserJSON && permittedBranches === false && !fetchPermittedBranchesLoading) {
      console.log('Fetching permitted branches...');
      dispatch(getPermittedBranches());
    }
  }, [dispatch]);

  // Update current branch when switch is successful
  useEffect(() => {
    if (switchedNewBranch) {
      setCurrentBranch(switchedNewBranch);
    }
  }, [switchedNewBranch]);

  // Set initial current branch if available
  useEffect(() => {
    if (permittedBranches && Array.isArray(permittedBranches.branches) && permittedBranches.branches.length > 0 && !currentBranch) {
      // You might want to get the current branch from localStorage or context
      // For now, we'll just show the first branch as current
      setCurrentBranch(permittedBranches.branches[0]);
    }
  }, [permittedBranches, currentBranch]);

  if (fetchPermittedBranchesLoading) {
    return (
      <Card title="Branch Information" style={{ marginBottom: 16 }}>
        <Spin size="small" /> Loading branch information...
      </Card>
    );
  }

  if (!permittedBranches || !Array.isArray(permittedBranches.branches) || permittedBranches.branches.length === 0) {
    return (
      <Card title="Branch Information" style={{ marginBottom: 16 }}>
        <Alert message="No permitted branches found" type="warning" />
      </Card>
    );
  }

  return (
    <Card 
      title="Branch Information" 
      style={{ marginBottom: 16 }}
      loading={switchNewBranchLoading}
    >
      <div style={{ marginBottom: 12 }}>
        <Text strong>Current Branch: </Text>
        {currentBranch ? (
          <Tag color="blue">{currentBranch.name}</Tag>
        ) : (
          <Tag color="default">Not selected</Tag>
        )}
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <Text strong>Available Branches: </Text>
        <Text>{permittedBranches.branches.length}</Text>
      </div>

      <div>
        <Text strong>All Permitted Branches:</Text>
        <div style={{ marginTop: 8 }}>
          {permittedBranches.branches.map((branch) => (
            <Tag 
              key={branch.id} 
              color={currentBranch && currentBranch.id === branch.id ? "green" : "default"}
              style={{ marginBottom: 4 }}
            >
              {branch.name}
            </Tag>
          ))}
        </div>
      </div>

      {switchNewBranchLoading && (
        <div style={{ marginTop: 12 }}>
          <Spin size="small" /> Switching branch...
        </div>
      )}
    </Card>
  );
};

export default BranchInfo;
