import React, { useContext } from 'react'
import CompleteDataContext from '../../Context';

import { connect } from 'react-redux';
import { deleteFuelPurchaseData } from '../../redux/actions/constTracker/costTracker.action';

import { notification, Table, Typography, Popconfirm, Dropdown, Space, Menu } from 'antd';
import { EditOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { sortArrayOfObjectByDate } from '../../helpers/genericHelpers';
import { numberFormatter } from '../../helpers/numberFormatter';


const openNotificationWithIcon = (type, formName) => {
  notification[type]({
    message: 'Bill Deleted',
    description: `The ${formName} has been successfully deleted`,
  });
};

const { Text } = Typography;

const DieselPurchasedTable = ({ data, userId, role, isLoading, setEditDieselPurchaseModal, setDieselPurchaseData, deleteFuelPurchaseData:deleteDieselPayment }) => {
  const {isMediumScreen} = useContext(CompleteDataContext);

  const getTariff = data?.map(element => {
    let amount = (element.price_per_litre * element.quantity) || 0;
    const newData = {
      ...element,
      amount: amount,
    }
    return newData
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  
  const isOperator = role === "OPERATOR";

  const handleDelete = async (id) => {
    const parameter = {
      id
    }
    const request = await deleteDieselPayment(userId, parameter)
    if (request.fullfilled) {
      openNotificationWithIcon('success', 'fuel purchase tracker');
    }
  };

  const optionsColumn = () => ({
    title: 'Options',
    width: '10%',
    render: (_, record) => {
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
                      setEditDieselPurchaseModal(true);
                      setDieselPurchaseData(record);
                    }}
                    rel="noopener noreferrer"
                  >Edit Diesel Purchase</a>
                </Space>
              </Menu.Item>
              <Menu.Item onClick={() => {}} type="link">
                <Space size={4}>
                  <Icon icon="ant-design:delete-outlined" />
                  <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                    <a>Delete Diesel Purchase</a>
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
      width: '25%',
    },
    {
      title: 'Quantity(Ltr)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '25%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },
    {
      title: 'Tariff(₦/Ltr)',
      dataIndex: 'price_per_litre',
      width: '25%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },
    {
      title: 'Amount(₦)',
      dataIndex: 'amount',
      width: '25%',
      render: (value) => {
        return value? numberFormatter(value.toFixed(2)) : 0;
      }
    },
    ...(isOperator ? [optionsColumn()] : [])
  ];

  let quantitySum = 0;
  let tariffSum = 0;
  let amountSum = 0;

  data && getTariff.forEach(element => {
    const quantity = parseFloat(element.quantity) || 0;
    const tariff = parseFloat(element.price_per_litre) || 0
    const amount = parseFloat(element.amount) || 0;
    quantitySum += quantity;
    tariffSum += tariff;
    amountSum += amount;
  });


  return (
    <div>
      <Table columns={columns}
        dataSource={sortArrayOfObjectByDate(getTariff)}
        className='table-striped-rows utitily-overview-table'
        rowKey={(record) => record.id}
        isLoading={isLoading}
        scroll={isMediumScreen && { x: 600, y: 300 }}

        summary={pageData => {

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(quantitySum).toFixed(2)) || 0}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat((tariffSum/getTariff?.length) || 0).toFixed(2)) || 0}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat((amountSum) || 0).toFixed(2))}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        footer={() => `${getTariff && getTariff.length} entries in total`}
      />
    </div>
  )
}

const mapDispatchToProps = {
  deleteFuelPurchaseData
}

export default connect(null, mapDispatchToProps)(DieselPurchasedTable)
