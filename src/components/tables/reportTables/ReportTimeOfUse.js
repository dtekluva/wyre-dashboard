import React from 'react';
import { Table, Typography } from 'antd';
import { convertDecimalTimeToNormal } from '../../../helpers/genericHelpers';

const { Text } = Typography
const ReportTimeOfUse = ({ data, columnData }) => {

    return (
        <Table
            rowKey="key"
            dataSource={data}
            columns={columnData}
            pagination={false}
            style={{ textAlign: 'center' }}
            className='report-table'
            // className='table-striped-rows'
            size={'middle'}
            summary={pageData => {

                let totalHours = 0;

                pageData.forEach(({ hour }) => {
                    totalHours += hour;
                });
                return (
                    <>
                        <Table.Summary.Row>
                            <Table.Summary.Cell>Total</Table.Summary.Cell>
                            <Table.Summary.Cell>
                                {/* <Text>{parseFloat(totalHours).toFixed(2)}</Text> */}
                                <Text>{convertDecimalTimeToNormal(parseFloat(totalHours).toFixed(2))}</Text>
                            </Table.Summary.Cell>
                            {/* <Table.Summary.Cell>
                                <Text>{parseFloat(totalBlackOut).toFixed(2)}</Text>
                            </Table.Summary.Cell> */}
                        </Table.Summary.Row>
                    </>
                );
            }}
        />
    );
}

export default ReportTimeOfUse;
