import React from 'react';
import { Table, Typography } from 'antd';

const { Text } = Typography;

function ReportOverviewTable({ data }) {
  const columns = [
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
    },
    {
      title: 'Utility (kWh)',
      dataIndex: 'utility_energy',
      key: 'utility_energy',
    },
    {
      title: 'Utility (₦)',
      dataIndex: 'utility_naira',
      key: 'utility_naira',
    },
    {
      title: 'IPP (kWh)',
      dataIndex: 'ipp_energy',
      key: 'ipp_energy',
    },
    {
      title: 'IPP (₦)',
      dataIndex: 'ipp_naira',
      key: 'ipp_naira',
    },
    {
      title: 'Gen (kWh)',
      dataIndex: 'gen_energy',
      key: 'gen_energy',
    },
    {
      title: 'Gen (₦)',
      dataIndex: 'gen_naira',
      key: 'gen_naira',
    },
    {
      title: 'Solar (kWh)',
      dataIndex: 'solar_energy',
      key: 'solar_energy',
    },
    {
      title: 'Solar (₦)',
      dataIndex: 'solar_naira',
      key: 'solar_naira',
    },
  ];

  return (
    <Table
      rowKey="key"
      dataSource={data}
      columns={columns}
      pagination={false}
      summary={(pageData) => {
        let totalUtilityNaira = 0;
        let totalUtilityEnergy = 0;
        let totaIppNaira = 0;
        let totaIppEnergy = 0;
        let totalGenNaira = 0;
        let totalGenEnergy = 0;
        let totalSolarNaira = 0;
        let totalSolarEnergy = 0;

        pageData.forEach(
          ({
            utility_energy,
            utility_naira,
            ipp_energy,
            ipp_naira,
            gen_energy,
            gen_naira,
            solar_energy,
            solar_naira,
          }) => {
            totalUtilityEnergy += utility_energy;
            totalUtilityNaira += utility_naira;
            totaIppNaira += ipp_naira;
            totaIppEnergy += ipp_energy;
            totalGenNaira += gen_naira;
            totalGenEnergy += gen_energy;
            totalSolarNaira += solar_naira;
            totalSolarEnergy += solar_energy;
          }
        );

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell>Total</Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totalUtilityEnergy}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totalUtilityNaira}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totaIppEnergy}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totaIppNaira}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totalGenEnergy}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totalGenNaira}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>{totalSolarEnergy}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text>
                  {totalSolarNaira && totalSolarNaira.includes('—')
                    ? '—'
                    : totalSolarNaira}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
}

export default ReportOverviewTable;
