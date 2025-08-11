import { useEffect, useState } from 'react';
import { Button, Drawer, Dropdown, Input, Menu, message, Select, Spin, Table, Tooltip, Typography } from 'antd';
import { ApartmentOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, connect } from 'react-redux';
import { getPermittedBranches, switchBranch } from '../redux/actions/auth/auth.action';

const { Search } = Input;
const { Text } = Typography;

const BranchSwitcher = ({ switchBranch, getPermittedBranches, query, setQuery, style }) => {
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [open, setOpen] = useState(false);
  // Get auth state from Redux
  const {
    permittedBranches,
    fetchPermittedBranchesLoading,
    switchNewBranchLoading,
    switchedNewBranch
  } = useSelector((state) => state.auth);

  // Fetch permitted branches on component mount
  useEffect(() => {
    // Check if user is authenticated and branches haven't been fetched yet
    const loggedUserJSON = localStorage.getItem('loggedWyreUser');
    if (loggedUserJSON && permittedBranches === false && !fetchPermittedBranchesLoading) {
      getPermittedBranches();
    }
  }, []);

  useEffect(() => {
    if (
      permittedBranches &&
      Array.isArray(permittedBranches.branches)
    ) {
      setFilteredBranches(permittedBranches.branches);
    }
  }, [permittedBranches]);

  // Handle successful branch switch
  useEffect(() => {
    if (switchedNewBranch) {
      localStorage.setItem('loggedWyreUser', JSON.stringify(switchedNewBranch.data.token));
      window.location.reload();
    }
  }, [switchedNewBranch]);

  // Show loading spinner while fetching branches
  // if (fetchPermittedBranchesLoading) {
  //   return <Spin size="small" />;
  // }

  // Don't render if no branches available
  // if (!permittedBranches || !Array.isArray(permittedBranches.branches) || permittedBranches.branches.length === 0) {
  //   return null;
  // }

  // if (fetchPermittedBranchesLoading || !filteredBranches) {
  //   return <Spin size="large" />;
  // }
  // if (!filteredBranches.length) {
  //   return <Text type="secondary">No branches available.</Text>;
  // }

  // const handleMenuClick = ({ key }) => {
  //   const branch = permittedBranches.branches.find(b =>  String(b.id) === key);
  //   if (branch) {
  //     message.success(`Switching to: ${branch.name}`);
  //     switchBranch(branch.id)
  //   }
  // };

  const handleSearch = (value) => {
    const filtered = permittedBranches.branches.filter((branch) =>
      branch.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBranches(filtered);
  };

  const handleSwitchBranch = (branch) => {
    message.loading(`Switching to ${branch.name}...`, 1);
    switchBranch(branch.id);
  };

  const handleRowClick = (record) => {
    // message.success(`Switching to: ${record.name}`);
    message.loading(`Switching to: ${record.name}`, 1);
    switchBranch(record.id);
  };

  if (fetchPermittedBranchesLoading) {
    return <Spin size="small" />;
  }

  if (!permittedBranches || !permittedBranches.branches?.length) {
    return null;
  }
  // const menu = (
  //   <Menu onClick={handleMenuClick}>
  //     {permittedBranches.branches.map(branch => (
  //       <Menu.Item key={branch.id}>{branch.name}</Menu.Item>
  //     ))}
  //   </Menu>
  // );

  const columns = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      responsive: ['md'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="Click to switch">
          <SwapOutlined
            onClick={() => handleRowClick(record)}
            style={{ cursor: 'pointer', fontSize: 18 }}
            spin={switchNewBranchLoading}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {/* <Dropdown
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
      </Dropdown> */}

      {/* <div style={{ ...style, padding: '1rem' }}> */}
      {/* <Search
        placeholder="Search branches..."
        onSearch={handleSearch}
        enterButton
        allowClear
        style={{ maxWidth: 300, marginBottom: 16 }}
      /> */}
      {/* <Table
        dataSource={filteredBranches}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        loading={switchNewBranchLoading}
        bordered
        rowClassName="branch-switch-row"
      /> */}
      <div
        title="Switch Branch"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={300}
      >
        {/* <Search
          placeholder="Search branches..."
          allowClear
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        /> */}
        <Input
          allowClear
          size="large"
          placeholder="Search for a branch"
          prefix={<SearchOutlined />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ borderRadius: 12, marginBottom: 16 }}
        />

        {filteredBranches.map((branch) => (
          <Button
            key={branch.id}
            block
            size="large"
            onClick={() => handleSwitchBranch(branch)}
            // style={{ marginBottom: 12, textAlign: 'left' }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              borderRadius: 12,
              background: "#f5f5f5",
              padding: "14px 10px",
              textAlign: "left",
            }}
            loading={switchNewBranchLoading}
          >
            {/* {branch.name} */}
            <span style={{ fontSize: 12, fontWeight: 400, color: "#000" }}>{branch.name}</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 20,
                borderRadius: 9999,
                border: "2px solid #6d28d9",
                color: "#6d28d9",
              }}
            >
              <SwapOutlined />
            </span>
          </Button>
        ))}

        {!filteredBranches.length && (
          <Text type="secondary">No branches match your search.</Text>
        )}
      </div>
    {/* </div> */}
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