import React, { useState } from 'react'
import moment from 'moment';
import { convertDecimalTimeToNormal } from '../../helpers/genericHelpers';
import { Modal, Table, Typography, Button, Dropdown, Popconfirm, Space, Menu, notification } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';

import { Icon } from '@iconify/react';
import UpdateDieselEntry from '../../mainAppPages/UpdateDieselEntry';
import { numberFormatter } from '../../helpers/numberFormatter';
import { deleteFuelConsumptionData } from '../../redux/actions/constTracker/costTracker.action';
import { connect } from 'react-redux';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';
const { Text } = Typography;


const DieselOverviewCostTrackerTable = (
  { dieselOverviewData, isLoading,
    userId,
    fetchFuelConsumptionInfo, deleteFuelConsumptionData: deleteDieselEntry }
) => {

  const [modalOpener, setModalOpener] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [flattenedModalData, setFlattenedModalData] = useState(false);
  const [fuelDataLoading, setFuelDataLoading] = useState(false);
  const [editDieselEntryModal, setEditDieselEntryModal] = useState(false)
  const [dieselEntryData, setDieselEntryData] = useState({})
  const [dataSources, setDataSources] = useState({})

  const openNotificationWithIcon = (type, formName) => {
    notification[type]({
      message: 'Bill Deleted',
      description: `The ${formName} has been successfully deleted`,
    });
  };

  const fetchFuelData = async (date) => {
    setModalData(false)
    const year = moment(date).format('YYYY');
    const month = moment(date).endOf('month').format('MM');


    // const queryString = `from_date=${startOfMonth}&to_date=${endOfMonth}`
    const queryString = `${userId}/${year}/${month}`

    setModalOpener(true);
    setFuelDataLoading(true);
    const fuelData = await fetchFuelConsumptionInfo(queryString);
    if (fuelData && fuelData.fullfilled) {
      const newDattta = fuelData.data.map((elementData) => {
        return {

          date: elementData.data.date,
          quantity: elementData.data.quantity,
          hours_of_use: elementData.data.hours_of_use,
          ...(elementData.data.energy_consumed['Gen 1'] ? { energy_consumed_gen_1: elementData.data.energy_consumed['Gen 1'] } : { energy_consumed_gen_1: 0 }),
          ...(elementData.data.energy_consumed['Gen 2'] ? { energy_consumed_gen_2: elementData.data.energy_consumed['Gen 2'] } : { energy_consumed_gen_2: 0 }),
          ...(elementData.data.energy_consumed['Gen 3'] ? { energy_consumed_gen_3: elementData.data.energy_consumed['Gen 3'] } : { energy_consumed_gen_3: 0 }),
          ...(elementData.data.energy_per_litre['Gen 1'] ? { energy_per_litre_gen_1: elementData.data.energy_per_litre['Gen 1'] } : { energy_per_litre_gen_1: 0 }),
          ...(elementData.data.energy_per_litre['Gen 1'] ? { energy_per_litre_gen_2: elementData.data.energy_per_litre['Gen 2'] } : { energy_per_litre_gen_2: 0 }),
          ...(elementData.data.energy_per_litre['Gen 3'] ? { energy_per_litre_gen_3: elementData.data.energy_per_litre['Gen 3'] } : { energy_per_litre_gen_3: 0 }),
        }
      })

      console.log("flatened-data ----------> ", newDattta);
      setModalData(newDattta);
    }
    setFuelDataLoading(false);
  }


  dieselOverviewData && dieselOverviewData.forEach(obj => {
    for (const propertyName in obj) {
      if (typeof obj[propertyName] === 'number') {
        obj[propertyName] = obj[propertyName].toFixed(2);
      }
    }
    return obj
  });

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      width: '10%',
      render: (month) => {
        // {month}
        return (
          <p onClick={() => fetchFuelData(month)} style={{ cursor: 'pointer', color: 'blue' }} >{month}</p>)
      }
    },
    {
      title: 'Inputted Usage(Ltr)',
      dataIndex: 'inputted_usage',
      key: 'inputted_usage',
      render: (inputted_usage) => numberFormatter(inputted_usage)
    },
    {
      title: 'Forecasted Usage (Ltr)',
      dataIndex: 'forecasted_usage',
      key: "forecasted_usage",
      render: (forecasted_usage) => numberFormatter(forecasted_usage)
    },
    {
      title: 'Inputted Cost (₦)',
      dataIndex: 'inputted_cost',
      key: 'inputted_cost',
      render: (inputted_cost) => numberFormatter(inputted_cost)
    },
    {
      title: 'Forecasted Cost (₦)',
      dataIndex: 'forecasted_cost',
      key: 'forecasted_cost',
      render: (forecasted_cost) => numberFormatter(forecasted_cost)
    },
    {
      title: 'Diesel Difference (Ltr)',
      dataIndex: 'diesel_difference',
      key: 'diesel_difference',
      render: (diesel_difference) => numberFormatter(diesel_difference)
    },
    {
      title: 'Price Difference (₦)',
      dataIndex: 'cost_difference',
      key: 'cost_difference',
      render: (cost_difference) => numberFormatter(cost_difference)
    },
    {
      title: 'Percentage Difference (%)',
      dataIndex: 'percentage_usage',
      key: 'percentage_usage',
      render: (percentage_usage) => numberFormatter(percentage_usage)
    },
  ];

  const entryId = dieselEntryData.id

  const handleDelete = async () => {
    const parameter = {
      id: entryId
    }
    const request = await deleteDieselEntry(entryId, parameter);
    if (request.fullfilled) {
      openNotificationWithIcon('success', 'diesel entry')
    }
  };

  const itemData = (record) => {
    return [
      {
        key: '1',
        label: (
          <>
            <EditOutlined />
            <a target="_blank" onClick={(e) => {
              e.preventDefault();
              setEditDieselEntryModal(true);
              setDieselEntryData(record)
            }} rel="noopener noreferrer">
              Edit Diesel Entry
            </a>
          </>

        ),
      },
      {
        key: '2',
        label: (<> {
          <>
            <Icon icon="ant-design:delete-outlined" />
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <a>Delete Diesel Entry</a>
            </Popconfirm>
          </>
        }
        </>

        ),
      }
    ];
  }

  const optionsColumn = () => ({
    title: 'Options',
    width: '10%',
    render: (_, record) => {
      const items = itemData(record);
      return (
        <Dropdown
          trigger={["click"]}
          getPopupContainer={(trigger) => trigger.parentElement}
          placement="topLeft"
          overlay={
            <Menu>
              <Menu.Item onClick={() => { }}>
                <Space size={4}>
                  <EditOutlined />{" "}
                  <a
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditDieselEntryModal(true);
                      setDieselEntryData(record);
                    }}
                    rel="noopener noreferrer"
                  >Edit Diesel Entry</a>
                </Space>
              </Menu.Item>
              <Menu.Item onClick={() => { }} type="link">
                <Space size={4}>
                  <Icon icon="ant-design:delete-outlined" />
                  <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                    <a
                      onClick={(e) => {
                        e.preventDefault()
                        setDieselEntryData(record)
                      }}
                    >Delete Diesel Entry</a>
                  </Popconfirm>
                </Space>
              </Menu.Item>
            </Menu>
          }
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            More <DownOutlined />
          </a>
        </Dropdown>
      );

    }


  });
  const fuelconsumptionColum = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: "date",
      width: '20%',
    },
    {
      title: 'Quantity(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
    },
    {
      title: 'Hours',
      dataIndex: 'hours_of_use',
      width: '15%',
      render: (hours) => convertDecimalTimeToNormal(hours?.toFixed(2))
    },
    {
      title: 'Energy(kWh)',
      dataIndex: 'energy_consumed',
      width: '15%',
    },
    {
      title: 'Liters/H',
      dataIndex: 'litres_per_hour',
      width: '15%',
    },
    {
      title: 'kWh/L',
      dataIndex: 'energy_per_litre',
      width: '15%',
    },
    optionsColumn()
  ];

  function onChange(pagination, filters, sorter, extra) {
    // console.log('params', pagination, filters, sorter, extra);
  }

  let inputtedUsageSum = 0;
  let forecastedUsageSum = 0;
  let inputtedCostSum = 0;
  let forecastedCostSum = 0;
  let dieselDifferenceSum = 0;
  let costDifferenceSum = 0;
  let percentageUsageSum = 0;

  dieselOverviewData && dieselOverviewData.forEach(element => {
    const inputtedUsage = parseFloat(element.inputted_usage)
    const forecastedUsage = parseFloat(element.forecasted_usage)
    const inputtedCost = parseFloat(element.inputted_cost)
    const forecastedCost = parseFloat(element.forecasted_cost)
    const dieselDifference = parseFloat(element.diesel_difference)
    const costDifference = parseFloat(element.cost_difference)
    const percentageUsage = parseFloat(element.percentage_usage)
    inputtedUsageSum += inputtedUsage;
    forecastedUsageSum += forecastedUsage;
    inputtedCostSum += inputtedCost;
    forecastedCostSum += forecastedCost;
    dieselDifferenceSum += dieselDifference;
    costDifferenceSum += costDifference;
    percentageUsageSum += percentageUsage;
  });

  return (
    <div>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={dieselOverviewData && dieselOverviewData}
        onChange={onChange}
        scroll={{ x: 1000 }}
        className="table-striped-rows utitily-overview-table"
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 6,
        }}
        summary={(pageData) => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {numberFormatter(parseFloat(inputtedUsageSum).toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {numberFormatter(parseFloat(forecastedUsageSum).toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {numberFormatter(parseFloat(inputtedCostSum).toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {numberFormatter(parseFloat(forecastedCostSum).toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {numberFormatter(
                      parseFloat(dieselDifferenceSum).toFixed(2)
                    )}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {numberFormatter(parseFloat(costDifferenceSum).toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>
                    {percentageUsageSum &&
                      parseFloat(
                        percentageUsageSum / dieselOverviewData.length
                      ).toFixed(2)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        footer={() =>
          `${dieselOverviewData && dieselOverviewData.length} entries in total`
        }
      />
      <Modal
        visible={editDieselEntryModal}
        onOk={() => setEditDieselEntryModal(false)}
        onCancel={() => setEditDieselEntryModal(false)}
        setDieselEntryData={setDieselEntryData}
        width={1000}
        footer={null}
      >
        <UpdateDieselEntry
          dieselEntryData={dieselEntryData}
          setModal={setEditDieselEntryModal}
        />
      </Modal>
      <Modal
        visible={modalOpener}
        onCancel={() => setModalOpener(false)}
        footer={null}
        width={1000}
      >
        <Table
          dataSource={modalData}
          loading={fuelDataLoading}
          rowKey="start_date"
          // columns={fuelconsumptionColum}
          pagination={{
            pageSize: 6,
          }}
        >
          <Column title="Date" dataIndex="date" key="date" />
          <Column title="Quantity(L)" dataIndex="quantity" key="quantity" />
          <Column title="Hours" dataIndex="hours_of_use" key="hours_of_use" />
          <ColumnGroup title="Energy(kWh)">
            <Column
              title="Gen1"
              dataIndex="GEN_1_500kVA_energy_consumed"
              key="GEN_1_500kVA_energy_consumed"
            />
            <Column
              title="Gen2"
              dataIndex="GEN_2_500kVA_energy_consumed"
              key="GEN_2_500kVA_energy_consumed"
            />
            <Column
              title="Gen3"
              dataIndex="GEN_3_275kVA_energy_consumed"
              key="GEN_3_275kVA_energy_consumed"
            />
          </ColumnGroup>
          <ColumnGroup title="Liters/H">
            <Column
              title="Gen1"
              dataIndex="GEN_1_500kVA_litres_per_hour"
              key="GEN_1_500kVA_litres_per_hour"
            />
            <Column
              title="Gen2"
              dataIndex="GEN_2_500kVA_litres_per_hour"
              key="GEN_2_500kVA_litres_per_hour"
            />
            <Column
              title="Gen3"
              dataIndex="GEN_3_275kVA_litres_per_hour"
              key="GEN_3_275kVA_litres_per_hour"
            />
          </ColumnGroup>
          <ColumnGroup title="kWh/L">
            <Column
              title="Gen1"
              dataIndex="GEN_1_500kVA_energy_per_litre"
              key="GEN_1_500kVA_energy_per_litre"
            />
            <Column
              title="Gen2"
              dataIndex="GEN_2_500kVA_energy_per_litre"
              key="GEN_2_500kVA_energy_per_litre"
            />
            <Column
              title="Gen3"
              dataIndex="GEN_3_275kVA_energy_per_litre"
              key="GEN_3_275kVA_energy_per_litre"
            />
          </ColumnGroup>
          <Column
            title="More"
            key="more"
            render={
              (_, record) => {
                const items = itemData(record);
                return (
                  <Dropdown
                    trigger={["click"]}
                    getPopupContainer={(trigger) => trigger.parentElement}
                    placement="topLeft"
                    overlay={
                      <Menu>
                        <Menu.Item onClick={() => { }}>
                          <Space size={4}>
                            <EditOutlined />{" "}
                            <a
                              target="_blank"
                              onClick={(e) => {
                                e.preventDefault();
                                setEditDieselEntryModal(true);
                                setDieselEntryData(record);
                              }}
                              rel="noopener noreferrer"
                            >Edit Diesel Entry</a>
                          </Space>
                        </Menu.Item>
                        <Menu.Item onClick={() => { }} type="link">
                          <Space size={4}>
                            <Icon icon="ant-design:delete-outlined" />
                            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                              <a
                                onClick={(e) => {
                                  e.preventDefault()
                                  setDieselEntryData(record)
                                }}
                              >Delete Diesel Entry</a>
                            </Popconfirm>
                          </Space>
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                      More <DownOutlined />
                    </a>
                  </Dropdown>
                );

              }
              // render={(_, record) => (
              //   <Space size="middle">
              //     <a>Invite {record.lastName}</a>
              //     <a>Delete</a>
              //   </Space>
              // )}
            }
          />
        </Table>
      </Modal>
    </div>
  );
}

const mapDispatchToProps = {
  deleteFuelConsumptionData
}

export default connect(null, mapDispatchToProps)(DieselOverviewCostTrackerTable)
