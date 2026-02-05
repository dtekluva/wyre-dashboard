import { useState } from 'react';
import moment from 'moment';
import { Modal, Table, Dropdown, Popconfirm, Space, notification } from 'antd';
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
console.log('dieselEntryData === ', dieselEntryData);

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

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      render: (month) => (
        <p
          onClick={() => fetchFuelData(month)}
          style={{ cursor: 'pointer', color: 'blue' }}
        >
          {month}
        </p>
      ),
    },
    { title: 'Inputted Usage(Ltr)', dataIndex: 'inputted_usage', render: numberFormatter },
    { title: 'Forecasted Usage (Ltr)', dataIndex: 'forecasted_usage', render: numberFormatter },
    { title: 'Inputted Cost (₦)', dataIndex: 'inputted_cost', render: numberFormatter },
    { title: 'Forecasted Cost (₦)', dataIndex: 'forecasted_cost', render: numberFormatter },
    { title: 'Diesel Difference (Ltr)', dataIndex: 'diesel_difference', render: numberFormatter },
    { title: 'Price Difference (₦)', dataIndex: 'cost_difference', render: numberFormatter },
    { title: 'Percentage Difference (%)', dataIndex: 'percentage_usage', render: numberFormatter },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dieselOverviewData}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 6 }}
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
                  <a onClick={(e) => e.preventDefault()}>
                    More <DownOutlined />
                  </a>
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