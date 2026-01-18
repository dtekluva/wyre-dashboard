import React from 'react';
import { Table, Input, Button, Space } from 'antd';
// import Highlighter from '../Highlighter';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from '../Highlighter';

class TimeOfUseTable extends React.Component {
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
    const data = this.props.timeOfUseData;

    const arrayRemove = (arr,value)=>{
        return arr.filter((element)=>{
          return element !== value
        })
    }


    const { Column } = Table;
    return (
      <>
        <Table
          className='table-striped-rows'
          dataSource={data && data.time_of_use_table.values}
          rowKey={(record) => record.id}
          pagination={{ position: ['none', 'bottomCenter'] }}
          footer={() => `${data.time_of_use_table.values.length} entries in total`}
        >
 
       {
       data.time_of_use_table.titles.map((headers, index)=>(
         <Column title={headers.toUpperCase()} dataIndex={headers}
          key= {headers}
          {...this.getColumnSearchProps({headers})}
          sorter= {(a, b) => headers === "post_datetime" ? new Date(a.headers) - new Date(b.headers) : a.headers - b.headers}
          sortDirections = {['descend', 'ascend']}
          />
        )) 
      }
        </Table>
      </>
    );
  }
}

export default TimeOfUseTable;
