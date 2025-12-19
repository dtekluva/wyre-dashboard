import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from '../../Highlighter';
import { SearchOutlined } from '@ant-design/icons';

class AdminBranchesTable extends React.Component {
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
    const data = this.props.listOfBranchesData;

    const columns = [
      {
        title: 'Branch Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
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
        title: 'Number of Sources',
        dataIndex: 'number_of_sources',
        key: 'number_of_sources',
        ...this.getColumnSearchProps('number_of_sources'),
        sorter: (a, b) => a.number_of_sources - b.number_of_sources,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'PAPR (%)',
        dataIndex: 'papr',
        key: 'papr',
        ...this.getColumnSearchProps('papr'),
        sorter: (a, b) => a.papr - b.papr,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Generator Efficiency (%)',
        dataIndex: 'generator_efficiency',
        key: 'generator_efficiency',
        ...this.getColumnSearchProps('generator_efficiency'),
        sorter: (a, b) => a.generator_efficiency - b.generator_efficiency,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Carbon Emission (%)',
        dataIndex: 'carbon_emission',
        key: 'carbon_emission',
        ...this.getColumnSearchProps('carbon_emission'),
        sorter: (a, b) => a.carbon_emission - b.carbon_emission,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Total Score (%)',
        dataIndex: 'total_score',
        key: 'total_score',
        ...this.getColumnSearchProps('total_score'),
        sorter: (a, b) => a.total_score - b.total_score,
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

export default AdminBranchesTable;
