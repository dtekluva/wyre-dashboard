import { useState } from 'react';
import moment from 'moment';
import { Modal, Table, Dropdown, Popconfirm, Space, notification, Button, Tooltip } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import UpdateDieselEntry from '../../mainAppPages/UpdateDieselEntry';
import { numberFormatter } from '../../helpers/numberFormatter';
import { deleteFuelConsumptionData } from '../../redux/actions/constTracker/costTracker.action';
import { connect } from 'react-redux';
import Column from 'antd/lib/table/Column';

const DieselOverviewCostTrackerTable = ({
  dieselOverviewData,
  isLoading,
  pagination,
  currentPage,
  onPageChange,
  userId,
  role,
  fetchFuelConsumptionInfo,
  deleteFuelConsumptionData: deleteDieselEntry,
}) => {
  const [modalOpener, setModalOpener] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [fuelDataLoading, setFuelDataLoading] = useState(false);
  const [editDieselEntryModal, setEditDieselEntryModal] = useState(false);
  const [dieselEntryData, setDieselEntryData] = useState({});

  const isOperator = role === 'OPERATOR';

  const openNotificationWithIcon = (type, formName) => {
    notification[type]({
      message: 'Bill Deleted',
      description: `The ${formName} has been successfully deleted`,
    });
  };

  const errorNotificationWithIcon = (type, formName) => {
    notification[type]({
      message: 'Failed',
      description: `Your attempt to delete the ${formName} cannot be completed at the moment, please try again`,
    });
  };

  const handleDelete = async (record) => {
    const entryId = record?.fuel_consumption_id;
    if (!entryId) return;

    const request = await deleteDieselEntry(entryId, { id: entryId });

    if (request?.fullfilled) {
      openNotificationWithIcon('success', 'daily diesel entry');
    } else {
      errorNotificationWithIcon('error', 'daily diesel entry');
    }
  };

  const itemData = (record) => [
    {
      key: 'edit',
      label: (
        <Space size={6}>
          <EditOutlined />
          <span>Edit Diesel Entry</span>
        </Space>
      ),
      onClick: () => {
        setEditDieselEntryModal(true);
        setDieselEntryData(record);
      },
    },
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record)}
        >
          <Space size={6}>
            <Icon icon="ant-design:delete-outlined" />
            <span>Delete Diesel Entry</span>
          </Space>
        </Popconfirm>
      ),
    },
  ];

  const fetchFuelData = async (date) => {
    const year = moment(date).format('YYYY');
    const month = moment(date).endOf('month').format('MM');
    const queryString = `${userId}/${year}/${month}`;

    setModalOpener(true);
    setFuelDataLoading(true);

    const fuelData = await fetchFuelConsumptionInfo(queryString);

    if (fuelData?.fullfilled) {
      const mapped = fuelData.data.map((d) => ({
        fuel_consumption_id: d.fuel_consumption_id,
        date: d.date,
        quantity: d.quantity,
        hours_of_use: d.hours_of_use,
        ...(!isNaN(d.energy_consumed['Gen 1']) && { energy_consumed_gen_1: d.energy_consumed['Gen 1'] }),
        ...(!isNaN(d.energy_consumed['Gen 2']) && { energy_consumed_gen_2: d.energy_consumed['Gen 2'] }),
        ...(!isNaN(d.energy_consumed['Gen 3']) && { energy_consumed_gen_3: d.energy_consumed['Gen 3'] }),
        ...(!isNaN(d.litres_per_hour['Gen 1']) && { litres_per_hour_gen_1: d.litres_per_hour['Gen 1'] }),
        ...(!isNaN(d.litres_per_hour['Gen 2']) && { litres_per_hour_gen_2: d.litres_per_hour['Gen 2'] }),
        ...(!isNaN(d.litres_per_hour['Gen 3']) && { litres_per_hour_gen_3: d.litres_per_hour['Gen 3'] }),
      }));

      setModalData(mapped);
    }

    setFuelDataLoading(false);
  };

  const renderColumnTitle = (shortTitle, fullTitle) => (
    <Tooltip title={fullTitle}>
      <span className="diesel-overview-table__header">{shortTitle}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: renderColumnTitle('Month', 'Month'),
      dataIndex: 'month',
      width: '12%',
      render: (month) => (
        <button
          type="button"
          className="diesel-overview-table__month-link"
          onClick={() => fetchFuelData(month)}
        >
          {month}
        </button>
      ),
    },
    {
      title: renderColumnTitle('Input (L)', 'Inputted Usage (Ltr)'),
      dataIndex: 'inputted_usage',
      align: 'right',
      render: numberFormatter,
    },
    {
      title: renderColumnTitle('Forecast (L)', 'Forecasted Usage (Ltr)'),
      dataIndex: 'forecasted_usage',
      align: 'right',
      render: numberFormatter,
    },
    {
      title: renderColumnTitle('Input (₦)', 'Inputted Cost (₦)'),
      dataIndex: 'inputted_cost',
      align: 'right',
      render: numberFormatter,
    },
    {
      title: renderColumnTitle('Forecast (₦)', 'Forecasted Cost (₦)'),
      dataIndex: 'forecasted_cost',
      align: 'right',
      render: numberFormatter,
    },
    {
      title: renderColumnTitle('Diff (L)', 'Diesel Difference (Ltr)'),
      dataIndex: 'diesel_difference',
      align: 'right',
      render: numberFormatter,
    },
    {
      title: renderColumnTitle('Diff (₦)', 'Price Difference (₦)'),
      dataIndex: 'cost_difference',
      align: 'right',
      render: numberFormatter,
    },
    {
      title: renderColumnTitle('Diff (%)', 'Percentage Difference (%)'),
      dataIndex: 'percentage_usage',
      align: 'right',
      render: numberFormatter,
    },
  ];

  const tablePagination = pagination
    ? {
        current: currentPage ?? pagination.current_page,
        pageSize: pagination.page_size,
        total: pagination.total_count,
        showSizeChanger: false,
        onChange: onPageChange,
      }
    : false;

  return (
    <div className="diesel-overview-table-wrapper">
      <Table
        className="diesel-overview-table"
        columns={columns}
        dataSource={dieselOverviewData}
        loading={isLoading}
        rowKey={(record, index) => record.month ?? record.id ?? record.key ?? index}
        pagination={tablePagination}
        size="small"
        tableLayout="fixed"
      />

      <Modal
        open={editDieselEntryModal}
        onCancel={() => setEditDieselEntryModal(false)}
        footer={null}
        width={1000}
      >
        <UpdateDieselEntry
          dieselEntryData={dieselEntryData}
          setModal={setEditDieselEntryModal}
        />
      </Modal>

      <Modal
        open={modalOpener}
        onCancel={() => setModalOpener(false)}
        footer={null}
        width={1000}
      >
        <Table
          dataSource={modalData}
          loading={fuelDataLoading}
          rowKey="fuel_consumption_id"
          pagination={{ pageSize: 6 }}
        >
          <Column title="Date" dataIndex="date" />
          <Column title="Quantity(L)" dataIndex="quantity" />
          <Column title="Hours" dataIndex="hours_of_use" />
          {isOperator && (
            <Column
              title="More"
              render={(_, record) => (
                <Dropdown
                  trigger={['click']}
                  placement="topLeft"
                  menu={{ items: itemData(record) }}
                >
                  <Button
                    type="link"
                    onClick={(e) => e.preventDefault()}
                    style={{ padding: 0, height: 'auto', lineHeight: 'inherit' }}
                  >
                    More <DownOutlined />
                  </Button>
                </Dropdown>
              )}
            />
          )}
        </Table>
      </Modal>
    </div>
  );
};

const mapDispatchToProps = {
  deleteFuelConsumptionData,
};

export default connect(null, mapDispatchToProps)(DieselOverviewCostTrackerTable);