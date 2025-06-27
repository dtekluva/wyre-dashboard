import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import { numberFormatter } from "../../helpers/numberFormatter"
import { sortByDateTime } from '../../helpers/genericHelpers';

class PowerDemandTable extends React.Component {
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
    const sortedData = sortByDateTime(this.props.powerDemandData);
    const data = sortedData.map((dataItem) => {
      const { min, max, avg, name } = dataItem

      return {
        ...dataItem,
        name,
        min: numberFormatter(min.toFixed(2)),
        max: numberFormatter(max.toFixed(2)),
        avg: numberFormatter(avg.toFixed(2))
      }
    });
    const unit = this.props.powerDemandUnit;
    
    const columns = [
      {
        title: 'Index',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        ...this.getColumnSearchProps('date'),
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        ...this.getColumnSearchProps('time'),
        sorter: (a, b) => a.time.localeCompare(b.time),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Source`,
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Minimum (${unit})`,
        dataIndex: 'min',
        key: 'min',
        ...this.getColumnSearchProps('min'),
        sorter: (a, b) => a.min - b.min,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Maximum (${unit})`,
        dataIndex: 'max',
        key: 'max',
        ...this.getColumnSearchProps('max'),
        sorter: (a, b) => a.max - b.max,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Average (${unit})`,
        dataIndex: 'avg',
        key: 'avg',
        ...this.getColumnSearchProps('avg'),
        sorter: (a, b) => a.avg - b.avg,
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
          pagination={{ position: ['none', 'bottomCenter'] }}
          footer={() => `${data && data.length} entries in total`}
        />
      </>
    );
  }
}

export default PowerDemandTable;