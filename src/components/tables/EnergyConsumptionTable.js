import React from 'react';
import { Table, Input, Button, Space } from 'antd';
// import Highlighter from '../Highlighter';
import { SearchOutlined } from '@ant-design/icons';
import { sortByDateTime } from '../../helpers/genericHelpers';
import Highlighter from '../Highlighter';

class EnergyConsumptionTable extends React.Component {
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
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
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
    const data = sortByDateTime(this.props.energyConsumptionData);
    const unit = this.props.energyConsumptionUnit;


    const dataForEnergyConsumptionColumns =
      data &&
      data.map((eachRow) => {
        const { index, date, time, ...energyConsumptionValues } = eachRow;
        return energyConsumptionValues;
      });

    const deviceNames =
      dataForEnergyConsumptionColumns && dataForEnergyConsumptionColumns.length &&
      Object.keys(dataForEnergyConsumptionColumns[0]);

    const energyConsumptionColumns =
      deviceNames &&
      deviceNames.map((eachName) => {
        return {
          title: `${eachName} (${unit})`,
          dataIndex: `${eachName}`,
          key: `${eachName}`,
          ...this.getColumnSearchProps(`${eachName}`),
          sorter: (a, b) => a[`${eachName}`] - b[`${eachName}`],
          sortDirections: ['descend', 'ascend'],
        };
      });

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
      ...(energyConsumptionColumns || []),
    ];


    return (
      <>
        <Table
          className="table-striped-rows"
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

export default EnergyConsumptionTable;
