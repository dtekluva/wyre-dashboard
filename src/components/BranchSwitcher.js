import { useEffect, useState } from 'react';
import { Button, Drawer, Dropdown, Input, List, Menu, message, Select, Spin, Table, Tooltip, Typography } from 'antd';
import { ApartmentOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, connect } from 'react-redux';
import { getPermittedBranches, switchBranch } from '../redux/actions/auth/auth.action';

const { Search } = Input;
const { Text } = Typography;
const CircleSwitchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.0526 0C10.5688 0 8.14074 0.733112 6.07551 2.10663C4.01028 3.48015 2.40063 5.43238 1.4501 7.71646C0.499582 10.0005 0.250882 12.5139 0.735454 14.9386C1.22003 17.3634 2.41611 19.5907 4.17244 21.3388C5.92878 23.087 8.16649 24.2775 10.6026 24.7598C13.0387 25.2421 15.5638 24.9946 17.8586 24.0485C20.1533 23.1024 22.1147 21.5002 23.4946 19.4446C24.8746 17.389 25.6111 14.9723 25.6111 12.5C25.6111 9.18479 24.288 6.00537 21.9328 3.66116C19.5777 1.31696 16.3834 0 13.0526 0ZM13.0526 22.7273C11.0204 22.7273 9.03381 22.1274 7.34408 21.0037C5.65434 19.8799 4.33736 18.2826 3.55966 16.4138C2.78196 14.545 2.57847 12.4887 2.97494 10.5048C3.37141 8.52086 4.35002 6.69853 5.78702 5.26822C7.22402 3.83792 9.05488 2.86386 11.0481 2.46924C13.0412 2.07462 15.1072 2.27715 16.9848 3.05123C18.8623 3.82531 20.467 5.13616 21.5961 6.81803C22.7251 8.4999 23.3278 10.4772 23.3278 12.5C23.3278 15.2124 22.2452 17.8138 20.3182 19.7318C18.3913 21.6498 15.7778 22.7273 13.0526 22.7273Z"
      fill="currentColor"
    />
    <path
      d="M21.3755 9.78874C21.3875 9.69442 21.3875 9.59897 21.3755 9.50465V9.43647C21.375 9.31581 21.3518 9.19633 21.307 9.08419C21.2596 8.95662 21.1857 8.84045 21.0901 8.74329L17.6651 5.3342C17.5586 5.22824 17.4322 5.1442 17.2932 5.08685C17.1541 5.02951 17.005 5 16.8545 5C16.7039 5 16.5549 5.02951 16.4158 5.08685C16.2767 5.1442 16.1503 5.22824 16.0439 5.3342C15.9374 5.44015 15.853 5.56593 15.7954 5.70437C15.7378 5.8428 15.7081 5.99117 15.7081 6.14101C15.7081 6.29085 15.7378 6.43923 15.7954 6.57766C15.853 6.71609 15.9374 6.84188 16.0439 6.94783L17.5509 8.3001H13.4523C13.1495 8.3001 12.8591 8.41983 12.645 8.63294C12.4309 8.84605 12.3106 9.13508 12.3106 9.43647C12.3106 9.73785 12.4309 10.0269 12.645 10.24C12.8591 10.4531 13.1495 10.5728 13.4523 10.5728H17.5509L16.0667 12.0387C15.9597 12.1444 15.8748 12.2701 15.8168 12.4085C15.7588 12.547 15.729 12.6955 15.729 12.8456C15.729 12.9956 15.7588 13.1441 15.8168 13.2826C15.8748 13.4211 15.9597 13.5467 16.0667 13.6524C16.1728 13.7589 16.2991 13.8434 16.4382 13.9011C16.5774 13.9588 16.7266 13.9885 16.8773 13.9885C17.028 13.9885 17.1772 13.9588 17.3164 13.9011C17.4555 13.8434 17.5818 13.7589 17.6879 13.6524L21.1129 10.2433C21.2051 10.1434 21.2786 10.028 21.3299 9.90238C21.3518 9.86755 21.3673 9.82905 21.3755 9.78874ZM13.4523 15.1183H9.35362L10.8378 13.6524C11.0528 13.4384 11.1736 13.1482 11.1736 12.8456C11.1736 12.5429 11.0528 12.2527 10.8378 12.0387C10.6228 11.8248 10.3312 11.7045 10.0272 11.7045C9.72319 11.7045 9.43161 11.8248 9.21662 12.0387L5.79158 15.4478C5.69942 15.5477 5.62596 15.6631 5.57466 15.7887C5.56828 15.8263 5.56828 15.8648 5.57466 15.9024C5.54353 15.9943 5.52435 16.0897 5.51758 16.1865V16.2546C5.51811 16.3753 5.54134 16.4948 5.58608 16.6069C5.63346 16.7345 5.70738 16.8507 5.803 16.9478L9.22804 20.3569C9.33417 20.4634 9.46045 20.548 9.59957 20.6057C9.73869 20.6634 9.88792 20.6931 10.0386 20.6931C10.1893 20.6931 10.3386 20.6634 10.4777 20.6057C10.6168 20.548 10.7431 20.4634 10.8492 20.3569C10.9562 20.2513 11.0412 20.1256 11.0991 19.9871C11.1571 19.8486 11.1869 19.7001 11.1869 19.5501C11.1869 19.4001 11.1571 19.2516 11.0991 19.1131C11.0412 18.9746 10.9562 18.8489 10.8492 18.7433L9.35362 17.391H13.4523C13.7551 17.391 14.0454 17.2713 14.2595 17.0582C14.4737 16.8451 14.5939 16.556 14.5939 16.2546C14.5939 15.9533 14.4737 15.6642 14.2595 15.4511C14.0454 15.238 13.7551 15.1183 13.4523 15.1183Z"
      fill="currentColor"
    />
  </svg>
)

const BranchSwitcher = ({ switchBranch, getPermittedBranches, panelOpen, setPanelOpen, style }) => {
  const [filteredBranches, setFilteredBranches] = useState([]);
  // const [panelOpen, setPanelOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("")
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
    message.loading(`Switching to ${branch.name}...`, 3);
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
      {/* <div style={{ ...style, padding: '1rem' }}> */}
      <div
        title="Switch Branch"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={300}
      >
        {/* <Input
          className="custom-search"
          allowClear
          placeholder="Search for a branch"
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            const value = e.target.value.toLowerCase();
            const filtered = permittedBranches.branches.filter((branch) =>
              branch.name.toLowerCase().includes(value)
            );
            setFilteredBranches(filtered);
          }}
          style={{
            marginBottom: 12,
            borderRadius: 8,
            background: "#8686864D"
          }}
        /> */}
        {/* <Input
          allowClear
          placeholder="Search for a branch"
          prefix={<SearchOutlined style={{ color: "#ccc" }} />}
          value={query}
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            setQuery(e.target.value);
            const filtered = permittedBranches.branches.filter((branch) =>
              branch.name.toLowerCase().includes(value)
            );
            setFilteredBranches(filtered);
          }}
          className="branch-search"
          style={{
            marginBottom: 12,
            borderRadius: 8,
            background: "#5C12A71A",
            color: "white"
          }}
          styles={{
            input: {
              background: "#5C12A71A",
              color: "white"
            }
          }}
        /> */}

        <Input
          allowClear
          placeholder="Search for a branch"
          prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
          value={query}
          onChange={handleSearch}
          className="unified-search-bar"
          style={{
            marginBottom: 32,
            borderRadius: 10,
            background: "#5C12A71A",
            border: "1px",
            height: 44,
          }}
          styles={{
            input: {
              background: "transparent",
              color: "white",
              fontSize: 16,
              fontWeight: 400,
            },
          }}
        />

        <List
          dataSource={filteredBranches}
          renderItem={(branch) => (
            <Button
              key={branch.id}
              block
              size="large"
              onClick={() => {
                handleSwitchBranch(branch)
                setPanelOpen(false)
              }}
              style={{
                width: "100%",
                height: 59,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                // background: "#f5f5f5",
                background: "#DADADA33",
                marginBottom: "8px",
                borderRadius: "8px",
                padding: "14px 12px",
                textAlign: "left",
                // border: "1px solid #e5e5e5",
                boxShadow: "none",
                border: "none"
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>
                {branch.name}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  width: 20,
                  borderRadius: "50%",
                  // border: "2px solid #6d28d9",
                  color: "#6d28d9",
                }}
              >
                <CircleSwitchIcon />
              </span>
            </Button>
          )}
        />
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