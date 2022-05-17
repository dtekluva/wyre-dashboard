import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class AdminBranchDevicesViewTable extends React.Component {
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
        const data = this.props.listOfBranchDevicesViewData;

        const columns = [
            {
                title: 'Device Name',
                dataIndex: 'device_name',
                key: 'device_name',
                sorter: (a, b) => a.device_name.localeCompare(b.device_name),
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Device Identity',
                dataIndex: 'device_identity',
                key: 'device_identity',
                sorter: (a, b) => a.device_identity.localeCompare(b.device_identity),
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Source',
                dataIndex: 'source',
                key: 'source',
                sorter: (a, b) => a.source - b.source,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Load',
                dataIndex: 'load',
                key: 'load',
                sorter: (a, b) => a.load - b.load,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                sorter: (a, b) => a.type - b.type,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Active',
                dataIndex: 'active',
                key: 'active',
                sorter: (a, b) => a.active - b.active,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Icon Type',
                dataIndex: 'icon_type',
                key: 'icon_type',
                sorter: (a, b) => a.icon_type - b.icon_type,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
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

export default AdminBranchDevicesViewTable;
