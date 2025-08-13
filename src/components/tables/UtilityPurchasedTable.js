import React, { useContext } from 'react'
import CompleteDataContext from '../../Context';
import { Table, notification, Typography, Dropdown, Popconfirm, Space, Menu } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { sortArrayOfObjectByDate } from '../../helpers/genericHelpers';

import { deletePrepaidUtilityPaymentData } from '../../redux/actions/constTracker/costTracker.action';
import { connect } from 'react-redux';
import { numberFormatter } from '../../helpers/numberFormatter';


const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Deleted',
    description: `The ${formName} has been successfully deleted`,
  });
};

const { Text } = Typography;

const UtilityPurchasedTable = ({ data, userId, role, setEditUtilityPurchaseModal, setUtilityPurchaseData, deletePrepaidUtilityPaymentData:deletePrepaidPayment }) => {
  const {
    isMediumScreen
  } = useContext(CompleteDataContext);

  const sortedData = sortArrayOfObjectByDate(data);
  const isOperator = role === "OPERATOR";

  const handleDelete = async (id) => {
    const parameter = {
      id
    }
    const request = await deletePrepaidPayment(userId, parameter)
    if (request.fullfilled) {
      openNotificationWithIcon('success', 'Utility purchase tracker');
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
              setEditUtilityPurchaseModal(true);
              setUtilityPurchaseData(record)
            }} rel="noopener noreferrer">
              Edit Utility Purchase
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
              <a>Delete Utility Purchase</a>
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
              <Menu.Item onClick={() => {}}>
                <Space size={4}>
                  <EditOutlined />{" "}
                  <a
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditUtilityPurchaseModal(true);
                      setUtilityPurchaseData(record);
                    }}
                    rel="noopener noreferrer"
                  >Edit Utility Purchase</a>
                </Space>
              </Menu.Item>
              <Menu.Item onClick={() => {}} type="link">
                <Space size={4}>
                  <Icon icon="ant-design:delete-outlined" />
                  <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                    <a>Delete Utility Purchase</a>
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

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
    },
    {
      title: 'Unit(kWh)',
      dataIndex: 'value',
      key: 'value',
      width: '20%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },
    {
      title: 'Tariff(₦/kWh)',
      dataIndex: 'tarrif',
      key: "tarrif",
      width: '20%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },
    {
      title: 'Amount(₦)',
      dataIndex: 'amount',
      key: "amount",
      width: '20%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },

    {
      title: 'VAT Inclusive amount(₦)',
      dataIndex: 'vat_inclusive_amount',
      key: "vat_inclusive_amount",
      width: '20%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },
    ...(isOperator ? [optionsColumn()] : [])
  ];

  let valueSum = 0;
  let tarrifSum = 0;
  let amountSum = 0;
  let vatInclusiveAmountSum = 0;


  data && data.forEach(element => {
    const value = parseFloat(element.value) || 0;
    const tarrif = parseFloat(element.tarrif) || 0;
    const amount = parseFloat(element.amount) || 0;
    const vatInclusiveAmount = parseFloat(element.vat_inclusive_amount) || 0;

    valueSum += value;
    tarrifSum += tarrif;
    amountSum += amount;
    vatInclusiveAmountSum += vatInclusiveAmount;

  });
  return (
    <div>
      <Table columns={columns}
        dataSource={sortedData}
        className='table-striped-rows utitily-overview-table'
        rowKey={(record) => record.id}
        scroll={isMediumScreen && { x: 600, y: 300 }}
        summary={pageData => {

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(valueSum).toFixed(2)) || 0}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(tarrifSum).toFixed(2)) || 0}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(amountSum).toFixed(2)) || 0}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(vatInclusiveAmountSum).toFixed(2)) || 0}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        footer={() => `${data && data.length} entries in total`} />
    </div>
  )
}

const mapDispatchToProps = {
  deletePrepaidUtilityPaymentData,
}

export default connect(null, mapDispatchToProps)(UtilityPurchasedTable)
