import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import CompleteDataContext from "../Context";

import Billing from '../mainAppPages/Billing';
import CostTracker from '../mainAppPages/CostTracker';
import Dashboard from '../mainAppPages/Dashboard';
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
import Breakers from '../mainAppPages/Breakers';
import SolarOverviewPage from '../mainAppPages/SolarOverviewPage';
import DieselOverviewPage from '../mainAppPages/DieselOverviewPage';
// import Breakers from '../mainAppPages/Breakers';

function MainAppPages() {
  const { currentUrl } = useContext(CompleteDataContext);

  return (
    <div className="app">
      <div className="sidebar-and-content">
        <Sidebar />

        <main className="main-container">
          <div className="old-top-bar-monitor">
            <TopBar />
          </div>

          <AppHeader />

          <div className="newTopbar-monitor">
            <RevisedAppTopBar />
          </div>

          <ScrollToTop>
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/billing" element={<Billing />} />

                <Route path="/cost-tracker" element={<CostTracker />} />
                <Route
                  path="/cost-tracker/add-bills"
                  element={<AddBills />}
                />
                <Route
                  path="/cost-tracker/add-diesel-entry"
                  element={<AddDieselEntry />}
                />
                <Route
                  path="/cost-tracker/add-equipment"
                  element={<AddEquipment />}
                />

                <Route
                  path="/parameters/last-reading"
                  element={<LastReading />}
                />
                <Route
                  path="/parameters/time-of-use"
                  element={<TimeOfUse />}
                />
                <Route
                  path="/parameters/power-demand"
                  element={<PowerDemand />}
                />
                <Route
                  path="/parameters/power-quality"
                  element={<PowerQuality />}
                />
                <Route
                  path="/parameters/energy-consumption"
                  element={<EnergyConsumption />}
                />

                <Route path="/report" element={<Report />} />
                <Route path="/score-card" element={<ScoreCard />} />
                <Route
                  path="/solar-overview"
                  element={<SolarOverviewPage />}
                />
                <Route
                  path="/diesel-overview"
                  element={<DieselOverviewPage />}
                />
                <Route
                  path="/client-profile"
                  element={<ClientProfile />}
                />
                <Route path="/password" element={<Password />} />
                <Route
                  path="/load-overview"
                  element={<LoadOverview />}
                />
                <Route
                  path="/alerts-and-alarms"
                  element={<AlertsAndAlarms />}
                />
                <Route
                  path="/branches"
                  element={<BranchesDevicesAndUsers />}
                />
                <Route
                  path="/branches/user-form"
                  element={<BranchesUserForm />}
                />

                <Route path="*" element={<Error />} />
              </Routes>
            </div>
          </ScrollToTop>
        </main>
      </div>
    </div>
  );
}

export default MainAppPages;
