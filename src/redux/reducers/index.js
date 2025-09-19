import { combineReducers } from 'redux';
import dashboard from './dashboard/dashboard.reducer';
import scorecard from './scorecard/scorecard.reducer';
import billing from './billing/billing.reducer';
import costTracker from './costTracker/costTracker.reducer';
import sideBar from './sidebar/sidebar.reducer'
import report from './report/report.reducer';
import setting from './setting/setting.reducer';
import powerFactor from './powerFactor/powerFactor.reducer';
import breakers from './breakers/breakers.reducer';
import parametersReducer from './parameters/parameters.reducer';
import dieselReducer from './diesel/diesel.reducer';
import auth from './auth/auth.reducers';

const appReducer = combineReducers({
    dashboard,
    scorecard,
    parametersReducer,
    dieselReducer,
    billing,
    sideBar,
    costTracker,
    report,
    setting,
    powerFactor,
    breakers,
    auth
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_USER') {
      return appReducer(undefined, action)
    }
  
    return appReducer(state, action)
  }

export default rootReducer;