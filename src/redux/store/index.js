import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import rootReducer from '../reducers';

const migrations = {
  0: (state) => ({
    ...state,
    ui: {
      ...state.ui,
    },
  }),
};

const persistConfig = {
  key: 'ui',
  storage,
  version: 0,
  whitelist: ['ui'],
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' }),
};

const initialState = {};
const enhancers = [];

const loggerMiddleware = store => next => action => {
  console.group(action.type);
  console.log('Prev state:', store.getState().parametersReducer);
  console.log('Action payload:', action.payload);
  const result = next(action);
  console.log('Next state:', store.getState().parametersReducer);
  console.groupEnd();
  return result;
};

const lastReadingLogger = store => next => action => {
  // Only log if the action type contains "LAST_READING"
  if (action.type && action.type.includes('LAST_READING')) {
    console.group(`🟢 ${action.type}`);
    console.log('Prev state:', store.getState().parametersReducer);
    console.log('Action payload:', action.payload);
    const result = next(action);
    console.log('Next state:', store.getState().parametersReducer);
    console.groupEnd();
    return result;
  }
  return next(action);
};

const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment && typeof window !== 'undefined' && window.window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.window.__REDUX_DEVTOOLS_EXTENSION__());
}

const persistentReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistentReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    ...enhancers,
  ),
);

export const persistedStore = persistStore(store);

export default store;