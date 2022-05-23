import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class AdminDevicesTable extends React.Component {
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
        title: 'Device Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Device Identity',
        dataIndex: 'deviceIdentity',
        key: 'deviceIdentity',
        ...this.getColumnSearchProps('deviceIdentity'),
        sorter: (a, b) => a.deviceIdentity.localeCompare(b.deviceIdentity),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Source',
        dataIndex: 'source',
        key: 'source',
        ...this.getColumnSearchProps('source'),
        sorter: (a, b) => a.source.localeCompare(b.source),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Load',
        dataIndex: 'load',
        key: 'load',
        ...this.getColumnSearchProps('load'),
        sorter: (a, b) => a.load.localeCompare(b.load),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        sorter: (a, b) => a.type - b.type,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        ...this.getColumnSearchProps('active'),
        sorter: (a, b) => a.active - b.active,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Icon Type',
        dataIndex: 'iconType',
        key: 'iconType',
        ...this.getColumnSearchProps('iconType'),
        sorter: (a, b) => a.iconType - b.iconType,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        key: 'key',
        dataIndex: 'key',
        render: (_, record) => (
          <button
            type='button'
            className='table-row-button'
            onClick={() => console.log(record)}
          >
            Edit
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

export default AdminDevicesTable;
