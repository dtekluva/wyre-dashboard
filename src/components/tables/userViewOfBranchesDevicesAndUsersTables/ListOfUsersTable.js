import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from '../../Highlighter';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import CompleteDataContext from '../../../Context';

class ListOfUsersTable extends React.Component {
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

  static contextType = CompleteDataContext;

  render() {
    const data = this.props.listOfUsersData;

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
        title: 'Email Address',
        dataIndex: 'email',
        key: 'email',
        ...this.getColumnSearchProps('email'),
        sorter: (a, b) => a.email.localeCompare(b.email),
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
        title: 'Organisation',
        dataIndex: 'organisation',
        key: 'organisation',
        ...this.getColumnSearchProps('organisation'),
        sorter: (a, b) => a.organisation.localeCompare(b.organisation),
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
        title: 'Added',
        dataIndex: 'added',
        key: 'added',
        ...this.getColumnSearchProps('added'),
        sorter: (a, b) => a.added.localeCompare(b.added),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        key: 'key',
        dataIndex: 'key',
        render: (_, record) => (
          <Link
            to='/branches/user-form'
            className='table-row-button table-row-button--link'
            onClick={() => {
              const formattedRowData = {
                id: record.id,
                name: record.name,
                phone: record.phone,
                email: record.email,
                organisation: record.organisation,
              };

              this.context.setPreloadedUserFormData(formattedRowData);
            }}
          >
            Edit
          </Link>
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

export default ListOfUsersTable;
