import { useState, useRef, useCallback } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { sortByDateTime } from '../../helpers/genericHelpers';
import Highlighter from '../Highlighter';

const EnergyConsumptionTable = ({
  energyConsumptionData = [],
  energyConsumptionUnit,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }, []);

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
    setSearchText('');
  }, []);

  const getColumnSearchProps = useCallback(
    (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputRef}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
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
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInputRef.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    }),
    [handleReset, handleSearch, searchText, searchedColumn]
  );

  const data = sortByDateTime(energyConsumptionData);
  const unit = energyConsumptionUnit;

  const dataForEnergyConsumptionColumns =
    data &&
    data.map(({ index, date, time, ...energyValues }) => energyValues);

  const deviceNames =
    dataForEnergyConsumptionColumns?.length > 0
      ? Object.keys(dataForEnergyConsumptionColumns[0])
      : [];

  const energyConsumptionColumns = deviceNames.map((name) => ({
    title: `${name} (${unit})`,
    dataIndex: name,
    key: name,
    ...getColumnSearchProps(name),
    sorter: (a, b) => a[name] - b[name],
    sortDirections: ['descend', 'ascend'],
  }));

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
      ...getColumnSearchProps('date'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      ...getColumnSearchProps('time'),
      sorter: (a, b) => a.time.localeCompare(b.time),
      sortDirections: ['descend', 'ascend'],
    },
    ...energyConsumptionColumns,
  ];

  return (
    <Table
      className="table-striped-rows"
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
      pagination={{ position: ['none', 'bottomCenter'] }}
      footer={() => `${data?.length || 0} entries in total`}
    />
  );
};

export default EnergyConsumptionTable;