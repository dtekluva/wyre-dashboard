import { Table, Typography } from 'antd';

const IppOverviewCostTrackerTable = ({ dataSource, isLoading }) => {
  const { Text } = Typography;
  dataSource && dataSource.forEach(obj => {
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
      width: '10%'
    },
    {
      title: 'Purchased Energy (kWh)',
      dataIndex: 'purchased_kwh',
    },
    {
      title: 'Consumed Energy (kWh)',
      dataIndex: 'energy_consumed_kwh',
    },
    {
      title: 'Purchased Energy(₦)',
      dataIndex: 'purchased_naira',
    },
    {
      title: 'Consumed Energy(₦)',
      dataIndex: 'energy_consumed_naira',
    },
    {
      title: 'Difference(kWh)',
      dataIndex: 'difference_kwh',
    },
    {
      title: 'Difference (₦)',
      dataIndex: 'difference_naira',
    },
    {
      title: 'Percentage Difference(%)',
      dataIndex: 'percentage',
    },
  ];


  let Purchased_total = 0;
  let Consumed_total = 0;
  let purchasedNaira = 0;
  let energyConsumedNairaSum = 0;
  let differenceKwhSum = 0;
  let differenceNairaSum = 0;
  let percentageSum = 0;

  dataSource && dataSource.forEach(element => {
    const purchased_numToInt = parseFloat(element.purchased_kwh)
    const consumed_to_int = parseFloat(element.energy_consumed_kwh)
    const purchasedInt = parseFloat(element.purchased_naira)
    const energyConsumedNaira = parseFloat(element.energy_consumed_naira)
    const differenceKwh = parseFloat(element.difference_kwh)
    const differenceNaira = parseFloat(element.difference_naira)
    const percentage = parseFloat(element.percentage)
    Purchased_total += purchased_numToInt;
    Consumed_total += consumed_to_int;
    purchasedNaira += purchasedInt;
    energyConsumedNairaSum += energyConsumedNaira;
    differenceKwhSum += differenceKwh;
    differenceNairaSum += differenceNaira;
    percentageSum += percentage;
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource && dataSource}
        className='table-striped-rows utitily-overview-table'
        rowKey={(record) => record.id}
        footer={() => `${dataSource && dataSource.length} entries in total`}
        scroll={{ x: 500 }}
        loading={isLoading}
        summary={pageData => {

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{parseFloat(Purchased_total).toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{parseFloat(Consumed_total).toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{parseFloat(purchasedNaira).toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{parseFloat(energyConsumedNairaSum).toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{parseFloat(differenceKwhSum).toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{parseFloat(differenceNairaSum).toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{percentageSum && parseFloat(percentageSum / dataSource.length).toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />

    </div>
  )
}

export default IppOverviewCostTrackerTable
