import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from '../../Highlighter';
import { SearchOutlined } from '@ant-design/icons';

import { numberFormatter } from "../../../helpers/numberFormatter";


class DemandsTable extends React.Component {
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
     const data = this.props.data.map((dataItem) => {
      const { l1, l2, l3 } = dataItem

      return {
        ...dataItem,
        l1: numberFormatter(l1.toFixed(2)),
        l2: numberFormatter(l2.toFixed(2)),
        l3: numberFormatter(l3.toFixed(2))
      }
    });

    const columns = [
      {
        title: `Phase`,
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Line 1`,
        dataIndex: 'l1',
        key: 'l1',
        ...this.getColumnSearchProps('l1'),
        sorter: (a, b) => a.l1 - b.l1,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Line 2`,
        dataIndex: 'l2',
        key: 'l2',
        ...this.getColumnSearchProps('l2'),
        sorter: (a, b) => a.l2 - b.l2,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Line 3`,
        dataIndex: 'l3',
        key: 'l3',
        ...this.getColumnSearchProps('l3'),
        sorter: (a, b) => a.l3 - b.l3,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Unit`,
        dataIndex: 'unit',
        key: 'unit',
        ...this.getColumnSearchProps('unit'),
        sorter: (a, b) => a.unit.localeCompare(b.unit),
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

export default DemandsTable;
