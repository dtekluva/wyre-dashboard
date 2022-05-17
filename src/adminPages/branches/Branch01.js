import React, { useEffect, useState, useContext } from 'react';
import { Row, Col } from 'antd';
import CompleteDataContext from '../../Context';

import adminHttpServices from '../../services/admin';

import BreadCrumb from '../../components/BreadCrumb';
import ExcelIcon from '../../icons/ExcelIcon';
import AdminBranchUsersViewTable from '../../components/tables/adminTables/AdminBranchUsersViewTable';
import AdminBranchDevicesViewTable from '../../components/tables/adminTables/AdminBranchDevicesViewTable';

const breadCrumbRoutes = [
    { url: '/', name: 'Home', id: 1 },
    { url: '#', name: 'Manage', id: 2 },
    { url: '#', name: 'View Organisation', id: 3 },
];

function Branch01({ match }) {
    const { setCurrentUrl } = useContext(CompleteDataContext);
    const [adminBranchUsersViewData, setAdminBranchUsersViewData] = useState([]);
    const [adminBranchDevicesViewData, setAdminBranchDevicesViewData] = useState([]);

    useEffect(() => {
        if (match && match.url) {
            setCurrentUrl(match.url);
        }
    }, [match, setCurrentUrl]);

    useEffect(() => {
        adminHttpServices.getAll('branchusersview').then((returnedData) => {
            setAdminBranchUsersViewData(returnedData);
        });
        adminHttpServices.getAll('branchdevicesview').then((returnedData) => {
            setAdminBranchDevicesViewData(returnedData);
        });
    }, []);

    return (
        <>
            <div className='breadcrumb-and-print-buttons'>
                <BreadCrumb routesArray={breadCrumbRoutes} />
            </div>

            <article className='table-with-header-container h-no-mt'>
                <div className='table-header h-border-bottom'>
                    <div className='h-hidden-medium-down'>
                        <button type='button' className='table-header__left-button'>
                            CSV
                        </button>
                    </div>

                    <h3 className='table-header__heading'>Richmond Gate</h3>

                    <button
                        type='button'
                        className='table-header__right-button h-hidden-medium-down'
                    >
                        <ExcelIcon />
                        <span>Download in Excel</span>
                    </button>
                </div>
                <div className="view_branch_top">
                    <Row>
                        <Col md={8}>
                            <div>
                                <p className='view_branch-text'>Total Energy: <span> 200.01KWh</span></p>
                                <p className='view_branch-text'>Baseline Score: <span> 200.01KWh</span></p>
                                <p className='view_branch-text'>Cost of Energy: <span> 200.01KWh</span></p>
                            </div>
                        </Col>
                        <Col md={8}>
                            <div>
                                <p className='view_branch-text'>Generator Efficiency: <span> 200.01KWh</span></p>
                                <p className='view_branch-text'>Fuel Efficiency: <span> 200.01KWh</span></p>
                                <p className='view_branch-text'>PAPR: <span> 200.01KWh</span></p>
                            </div>
                        </Col>
                    </Row>


                </div>
                <div className='h-overflow-auto'>
                    <div className='text-center'>
                        <h3 className='table-header__heading'>Users</h3>
                    </div>
                    <AdminBranchUsersViewTable listOfBranchesData={adminBranchUsersViewData} />
                </div>
                <div className='h-overflow-auto'>
                    <div className='text-center'>
                        <h3 className='table-header__heading'>Devices</h3>
                    </div>
                    <AdminBranchDevicesViewTable listOfBranchesData={adminBranchDevicesViewData} />
                </div>
            </article>

        </>
    );
}

export default Branch01