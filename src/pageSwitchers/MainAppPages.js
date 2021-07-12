import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import CompleteDataContext from '../Context';

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

function MainAppPages() {
  const { currentUrl } = useContext(CompleteDataContext);

  const isReportPageOpen = currentUrl.includes('report');

  return (
    <div className="app">
      <AppHeader />

      <div className="sidebar-and-content">
        <Sidebar />

        <main
          className={
            isReportPageOpen ? 'main-container h-full-width' : 'main-container'
          }
        >
          <TopBar />

          <ScrollToTop>
            <div className="page-content">
              <Switch>
                <Route exact path="/">
                  <Redirect to="/dashboard" />
                </Route>
                <Route path="/dashboard" component={Dashboard} />
                <Route exact path="/log-in">
                  <Redirect to="/" />
                </Route>
                <Route path="/billing" component={Billing} />
                <Route exact path="/cost-tracker" component={CostTracker} />
                <Route path="/cost-tracker/add-bills" component={AddBills} />
                <Route
                  path="/cost-tracker/add-equipment"
                  component={AddEquipment}
                />
                <Route path="/messages" component={Messages} />
                <Route
                  path="/parameters/last-reading"
                  component={LastReading}
                />
                <Route path="/parameters/time-of-use" component={TimeOfUse} />
                <Route
                  path="/parameters/power-demand"
                  component={PowerDemand}
                />
                <Route
                  path="/parameters/power-quality"
                  component={PowerQuality}
                />
                <Route
                  path="/parameters/energy-consumption"
                  component={EnergyConsumption}
                />
                <Route path="/report" component={Report} />
                <Route path="/score-card" component={ScoreCard} />
                <Route path="/client-profile" component={ClientProfile} />
                <Route path="/password" component={Password} />
                <Route path="/alerts-and-alarms" component={AlertsAndAlarms} />
                <Route
                  exact
                  path="/branches"
                  component={BranchesDevicesAndUsers}
                />
                <Route
                  path="/branches/user-form"
                  component={BranchesUserForm}
                />
                <Route component={Error} />
              </Switch>
            </div>
          </ScrollToTop>
        </main>
      </div>
    </div>
  );
}

export default MainAppPages;
