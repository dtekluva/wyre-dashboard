import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from '../../Highlighter';
import { SearchOutlined } from '@ant-design/icons';

class UserDevicesTable extends React.Component {
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
    const data = this.props.listOfDevicesData;

    const columns = [
      {
        title: 'Devices Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Branch',
        dataIndex: 'branch',
        key: 'branch',
        ...this.getColumnSearchProps('branch'),
        sorter: (a, b) => a.branch.localeCompare(b.branch),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        ...this.getColumnSearchProps('code'),
        sorter: (a, b) => a.code.localeCompare(b.code),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Added',
        dataIndex: 'added',
        key: 'added',
        ...this.getColumnSearchProps('added'),
        sorter: (a, b) => a.added.localeCompare(b.added),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Consumption',
        dataIndex: 'consumption',
        key: 'consumption',
        ...this.getColumnSearchProps('consumption'),
        sorter: (a, b) => a.consumption - b.consumption,
        sortDirections: ['descend', 'ascend'],
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

export default UserDevicesTable;
