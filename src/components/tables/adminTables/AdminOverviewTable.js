import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class AdminOverviewTable extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const data = this.props.overviewListData;

    const columns = [
      {
        title: 'Company Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Total Energy (kWh)',
        dataIndex: 'total_energy',
        key: 'total_energy',
        ...this.getColumnSearchProps('total_energy'),
        sorter: (a, b) => a.total_energy - b.total_energy,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Utility',
        dataIndex: 'utility',
        key: 'utility',
        ...this.getColumnSearchProps('utility'),
        sorter: (a, b) => a.utility - b.utility,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Diesel',
        dataIndex: 'diesel',
        key: 'diesel',
        ...this.getColumnSearchProps('diesel'),
        sorter: (a, b) => a.diesel - b.diesel,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Bench Mark',
        dataIndex: 'benchmark',
        key: 'benchmark',
        ...this.getColumnSearchProps('benchmark'),
        sorter: (a, b) => a.benchmark - b.benchmark,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Subscription Expiry',
        dataIndex: 'subscription_expiry',
        key: 'subscription_expiry',
        ...this.getColumnSearchProps('score'),
        sorter: (a, b) => a.subscription_expiry - b.subscription_expiry,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        key: 'key',
        dataIndex: 'key',
        render: (_, record) => (
          <button
            type='button'
            className='table-row-button branch-users-view-button'
            onClick={() => console.log(record)}
          >
            View
          </button>
        ),
      },
    ];

    return (
      <>
        <Table
          className='table-striped-rows'
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={false}
          footer={() => ``}
        />
      </>
    );
  }
}

export default AdminOverviewTable;
