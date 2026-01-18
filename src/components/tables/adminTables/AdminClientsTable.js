import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from '../../Highlighter';
import { SearchOutlined } from '@ant-design/icons';

class AdminClientsTable extends React.Component {
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
    const data = this.props.listOfClientsData;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone',
        key: 'phone',
        ...this.getColumnSearchProps('phone'),
        sorter: (a, b) => a.phone - b.phone,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Contact Person',
        dataIndex: 'contact_person',
        key: 'contact_person',
        ...this.getColumnSearchProps('contact_person'),
        sorter: (a, b) => a.contact_person.localeCompare(b.contact_person),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Plan (Months)',
        dataIndex: 'plan_months',
        key: 'plan_months',
        ...this.getColumnSearchProps('plan_months'),
        sorter: (a, b) => a.plan_months - b.plan_months,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Plan Expiry',
        dataIndex: 'plan_expiry',
        key: 'plan_expiry',
        ...this.getColumnSearchProps('plan_expiry'),
        sorter: (a, b) => a.plan_expiry.localeCompare(b.plan_expiry),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        key: 'key',
        dataIndex: 'key',
        render: (_, record) => (
          <div className='h-flex'>
            <button
              type='button'
              className='table-row-button'
              onClick={() => console.log(record)}
            >
              View
            </button>

            <button
              type='button'
              className='table-row-button h-ml-20'
              onClick={() => console.log(record)}
            >
              Disable
            </button>
          </div>
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

export default AdminClientsTable;
