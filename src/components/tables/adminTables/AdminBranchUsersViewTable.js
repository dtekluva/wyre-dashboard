import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import listOfBranchUsersViewData from '../../../services/BranchUsersView-SampleData.json'

class AdminBranchUsersViewTable extends React.Component {
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
        const data = this.props.listOfBranchUsersViewData;

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone_number',
                key: 'phone_number',
                sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Email Address',
                dataIndex: 'email_address',
                key: 'email_address',
                sorter: (a, b) => a.email_address - b.email_address,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Branch',
                dataIndex: 'branch',
                key: 'branch',
                sorter: (a, b) => a.branch - b.branch,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                sorter: (a, b) => a.role - b.role,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Permission',
                dataIndex: 'permission',
                key: 'permission',
                sorter: (a, b) => a.permission - b.permission,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Date Added',
                dataIndex: 'date_added',
                key: 'date_added',
                sorter: (a, b) => a.date_added - b.date_added,
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

export default AdminBranchUsersViewTable;
