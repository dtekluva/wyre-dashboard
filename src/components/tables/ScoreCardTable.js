import React from 'react';
import { Table, Input, Button, Space, Typography } from 'antd';
import Highlighter from '../Highlighter';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

class ScoreCardTable extends React.Component {
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
    const dataAndUnits = this.props.changeOverLagsData;

    const { data, units } = dataAndUnits
      ? dataAndUnits
      : { data: ['Empty'], units: { lag_duration: 'empty' } };

    const columns = [
      {
        title: 'Date of Supply',
        dataIndex: 'date',
        key: 'date',
        ...this.getColumnSearchProps('date'),
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: `Change Over Lags (${units && units.lag_duration})`,
        dataIndex: 'lag_duration',
        key: 'lag_duration',
        ...this.getColumnSearchProps('lag_duration'),
        sorter: (a, b) => a.lag_duration - b.lag_duration,
      },
      {
        title: `Diesel Cost (${units && units.diesel_cost})`,
        dataIndex: 'diesel_cost',
        key: 'diesel_cost',
        ...this.getColumnSearchProps('diesel_cost'),
        sorter: (a, b) => a.diesel_cost - b.diesel_cost,
      },
      {
        title: 'Value (Naira)',
        dataIndex: 'diesel_value',
        key: 'diesel_value',
        ...this.getColumnSearchProps('diesel_value'),
        sorter: (a, b) => a.diesel_value - b.diesel_value,
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
          summary={(pageData) => {
            let totalLagDuration = 0;
            let totalDieselCost = 0;
            let totalDieselValue = 0;

            pageData.forEach(({ lag_duration, diesel_cost, diesel_value }) => {
              totalLagDuration += lag_duration;
              totalDieselCost += diesel_cost;
              totalDieselValue += diesel_value;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell>Total:</Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text>{totalLagDuration.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text>{totalDieselCost.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text>{totalDieselValue.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </>
    );
  }
}

export default ScoreCardTable;
