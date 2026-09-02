import { Table, Typography } from 'antd';
import { numberFormatter } from '../../helpers/numberFormatter';

const UtilityOverviewCostTrackerTable = ({
  dataSource,
  isLoading,
  pagination,
  currentPage,
  onPageChange,
}) => {
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
      render: (purchased_kwh) => numberFormatter(purchased_kwh)
      
    },
    {
      title: 'Consumed Energy (kWh)',
      dataIndex: 'energy_consumed_kwh',
      render: (energy_consumed_kwh) => numberFormatter(energy_consumed_kwh)
    },
    {
      title: 'Purchased Energy(₦)',
      dataIndex: 'purchased_naira',
      render: (purchased_naira) => numberFormatter(purchased_naira)
    },
    {
      title: 'Consumed Energy(₦)',
      dataIndex: 'energy_consumed_naira',
      render: (energy_consumed_naira) => numberFormatter(energy_consumed_naira)
    },
    {
      title: 'Difference(kWh)',
      dataIndex: 'difference_kwh',
      render: (difference_kwh) => numberFormatter(difference_kwh)
    },
    {
      title: 'Difference (₦)',
      dataIndex: 'difference_naira',
      render: (difference_naira) => numberFormatter(difference_naira)
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

  const totalEntries = pagination?.total_count ?? (dataSource?.length ?? 0);

  const tablePagination = pagination && pagination.total_pages > 1
    ? {
        current: currentPage ?? pagination.current_page,
        pageSize: pagination.page_size,
        total: pagination.total_count,
        showSizeChanger: false,
        onChange: onPageChange,
      }
    : false;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource && dataSource}
        className='table-striped-rows utitily-overview-table'
        rowKey={(record, index) => record.month ?? record.id ?? index}
        footer={() => `${totalEntries} entries in total`}
        scroll={{ x: 500 }}
        loading={isLoading}
        pagination={tablePagination}
        summary={pageData => {

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(Purchased_total).toFixed(2))}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(Consumed_total).toFixed(2))}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(purchasedNaira).toFixed(2))}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(energyConsumedNairaSum).toFixed(2))}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(differenceKwhSum).toFixed(2))}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{numberFormatter(parseFloat(differenceNairaSum).toFixed(2))}</Text>
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

export default UtilityOverviewCostTrackerTable
