import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from '../Highlighter';
import { SearchOutlined } from '@ant-design/icons';
import { numberFormatter } from "../../helpers/numberFormatter";
import { sortByDateTime } from '../../helpers/genericHelpers';

class PowerQualityTable extends React.Component {
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
    const sortedData = sortByDateTime( this.props.powerQualityData);
    const data = sortedData.map((dataItem, key) => {

      const { l1, l2, l3, neutral, frequency, power_factor } = dataItem
      

      return {
        ...dataItem,
        l1: numberFormatter(l1?.toFixed(2)),
        l2: numberFormatter(l2?.toFixed(2)),
        l3: numberFormatter(l3?.toFixed(2)),
        // neutral: numberFormatter(neutral.toFixed(2)),
        frequency: numberFormatter(frequency?.toFixed(2)),
        power_factor: numberFormatter(power_factor?.toFixed(2))
      }
    });
    
    const unit = this.props.powerQualityUnit;

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
        title: `Line 1 (${unit})`,
        dataIndex: 'l1',
        key: 'l1',
        ...this.getColumnSearchProps('l1'),
        sorter: (a, b) => a.l1 - b.l1,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Line 2 (${unit})`,
        dataIndex: 'l2',
        key: 'l2',
        ...this.getColumnSearchProps('l2'),
        sorter: (a, b) => a.l2 - b.l2,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Line 3 (${unit})`,
        dataIndex: 'l3',
        key: 'l3',
        ...this.getColumnSearchProps('l3'),
        sorter: (a, b) => a.l3 - b.l3,
        sortDirections: ['descend', 'ascend'],
      },
      // {
      //   title: `Neutral (${unit})`,
      //   dataIndex: 'neutral',
      //   key: 'neutral',
      //   ...this.getColumnSearchProps('neutral'),
      //   sorter: (a, b) => a.neutral - b.neutral,
      //   sortDirections: ['descend', 'ascend'],
      // },
      {
        title: 'Frequency (Hz)',
        dataIndex: 'frequency',
        key: 'frequency',
        ...this.getColumnSearchProps('frequency'),
        sorter: (a, b) => a.frequency - b.frequency,
      },
      {
        title: 'Power Factor',
        dataIndex: 'power_factor',
        key: 'power_factor',
        ...this.getColumnSearchProps('power_factor'),
        sorter: (a, b) => a.power_factor - b.power_factor,
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

export default PowerQualityTable;