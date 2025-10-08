import React, { useContext } from 'react';
import { Route, Routes, Redirect, Navigate } from 'react-router-dom';

import CompleteDataContext from '../Context';

import Loader from "../components/Loader";

import AddBills from '../mainAppPages/AddBills';
import AddEquipment from '../mainAppPages/AddEquipment';
import Billing from '../mainAppPages/Billing';
import CostTracker from '../mainAppPages/CostTracker';
import Dashboard from '../mainAppPages/Dashboard';
import Messages from '../mainAppPages/Messages';
import Report from '../mainAppPages/Report';
import ScoreCard from '../mainAppPages/ScoreCard';
import Error from '../mainAppPages/Error';
import PowerQuality from '../mainAppPages/PowerQuality';
import EnergyConsumption from '../mainAppPages/EnergyConsumption';
import PowerDemand from '../mainAppPages/PowerDemand';
import TimeOfUse from '../mainAppPages/TimeOfUse';
import LastReading from '../mainAppPages/LastReading';
import ClientProfile from '../mainAppPages/ClientProfile';
import Password from '../mainAppPages/Password';
import AlertsAndAlarms from '../mainAppPages/AlertsAndAlarms';
import BranchesDevicesAndUsers from '../mainAppPages/BranchesDevicesAndUsers';
import BranchesUserForm from '../mainAppPages/BranchesUserForm';

import ScrollToTop from '../helpers/ScrollToTop';

import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/AppTopBar';
import LoadOverview from '../mainAppPages/LoadOverview';
import RevisedAppTopBar from '../components/RevisedAppTopBar';
import AddDieselEntry from '../mainAppPages/AddDieselEntry';
import Breakers from '../mainAppPages/Breakers';
import DieselOverviewPage from '../mainAppPages/DieselOverviewPage';
// import Breakers from '../mainAppPages/Breakers';

function MainAppPages() {
  const { currentUrl, isAuthenticatedDataLoading, deviceData } = useContext(CompleteDataContext);

  const isReportPageOpen = currentUrl.includes('report');

  return (
    <div className="app">
      {/* <AppHeader /> */}

      <div className="sidebar-and-content">
        <Sidebar />

        <main
          className={
            // isReportPageOpen ? 'main-container h-full-width' : 
            'main-container'
          }
        >
          <div className='old-top-bar-monitor'>
            <TopBar />
          </div>
          <AppHeader />
          <div className='newTopbar-monitor'>
            {/* <AppHeader /> */}
            <RevisedAppTopBar />
          </div>
          <ScrollToTop>
            <div className="page-content">
              {/* {!isAuthenticatedDataLoading ? */}
              <Routes>
                {/* <Route exact path="/"> */}
                {/* <Redirect to="/dashboard" /> */}
                {/* <Route path="/dashboard" element={<Dashboard to="/dashboard" replace />} /> */}
                {/* </Route> */}
                <Route path="/" element={<Dashboard to="/dashboard" replace />}/>
                <Route path="/dashboard" element={<Dashboard to="/dashboard" replace />} />
                <Route path="/breakers" element={<Breakers to="/breakers" replace />} />
                <Route path="/billing" element={<Billing to="/billing" replace />} />
                {/* <Route exact path="/log-in">
                  <Route path="/" element={<Navigate to="/" replace />} />
                </Route>
 
                <Route exact path="/cost-tracker" component={CostTracker} />
                <Route path="/cost-tracker/add-bills" component={AddBills} />
                <Route path="/cost-tracker/add-diesel-entry" component={AddDieselEntry} />
                <Route
                  path="/cost-tracker/add-equipment"
                  component={AddEquipment}
                />
                {/* <Route path="/messages" component={Messages} /> */}
                <Route
                  path="/parameters/last-reading"
                  element={<LastReading to="/parameters/last-reading" replace />}
                />
                <Route exact path="/cost-tracker" element={<CostTracker to="/cost-tracker" />} />
                <Route path="/parameters/time-of-use" element={<TimeOfUse to="/parameters/time-of-use" />} />
                <Route
                  path="/parameters/power-demand"
                  element={<PowerDemand to="/parameters/power-demand" />}
                />
                <Route
                  path="/parameters/power-quality"
                  element={<PowerQuality to="/parameters/power-quality" />}
                />
                <Route
                  path="/parameters/energy-consumption"
                  element={<EnergyConsumption to="/parameters/energy-consumption" />}
                />
                <Route path="/report" element={<Report to="/report" />} />
                {/* <Route path="/breakers" component={Breakers} /> */}
                <Route path="/score-card" element={<ScoreCard to="/score-card" />} />
                <Route path="/client-profile" component={ClientProfile} />
                {/* <Route path="/password" component={Dashboard} /> */}
                <Route path="/password" component={Password} />
                <Route path="/load-overview" element={<LoadOverview to="/load-overview" />} />
                <Route path="/alerts-and-alarms" element={<AlertsAndAlarms to="/alerts-and-alarms" />} />
                <Route path="/diesel-overview" element={<DieselOverviewPage to="/diesel-overview" />} />
                <Route
                  exact
                  path="/branches"
                  component={BranchesDevicesAndUsers}
                />
                <Route
                  path="/branches/user-form"
                  component={BranchesUserForm}
                />
                <Route path="*" element={<Error />} />
              </Routes>
              {/* : <Loader />} */}
            </div>
          </ScrollToTop>
        </main>
      </div>
    </div>
  );
}

export default MainAppPages;
