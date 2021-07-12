import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import dataHttpServices from './services/devices';

import { getRefinedOrganizationData } from './helpers/organizationDataHelpers';
import { getRenderedData } from './helpers/renderedDataHelpers';

// create context
const CompleteDataContext = React.createContext();

// create provider
const CompleteDataProvider = (props) => {
  /* -------------------------------------------------------------------
  /* Data Control ------------------------------------------------------
  --------------------------------------------------------------------*/
  const [organization, setOrganization] = useState({});
  const [renderedDataObjects, setRenderedDataObjects] = useState({});
  // Note: the rendered data objects state exludes data for the whole organisation
  const [refinedRenderedData, setRefinedRenderedData] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedBranches, setCheckedBranches] = useState({});
  const [checkedDevices, setCheckedDevices] = useState({});
  const [isAuthenticatedDataLoading, setIsAuthenticatedDataLoading] = useState(
    true
  );
  /*--------------------------------------------------------------------




  --------------------------------------------------------------------*/
  /* -------------------------------------------------------------------
  /* Nav and Sidebar Controls ------------------------------------------
  --------------------------------------------------------------------*/
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  /*--------------------------------------------------------------------


  

  --------------------------------------------------------------------*/
  /* -------------------------------------------------------------------
  /* Topbar Controls ---------------------------------------------------
  --------------------------------------------------------------------*/
  const [currentUrl, setCurrentUrl] = useState('/');
  const [powerQualityUnit, setPowerQualityUnit] = useState('Current (Amps)');
  // For main app-wide datetime-picker.
  // New requests fired when datetime range is changed.
  const [userDateRange, setUserDateRange] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [parametersDataTimeInterval, setParametersDataTimeInterval] = useState(
    ''
  );
  /*--------------------------------------------------------------------

  

  --------------------------------------------------------------------*/
  /* -------------------------------------------------------------------
  /* Authentication ----------------------------------------------------
  --------------------------------------------------------------------*/
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(undefined);
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  /*--------------------------------------------------------------------


  

  --------------------------------------------------------------------*/
  /* -------------------------------------------------------------------
  /* Media Queries -----------------------------------------------------
  --------------------------------------------------------------------*/
  const isSmallScreen = useMediaQuery({ query: '(max-width: 544px)' });
  const isMediumScreen = useMediaQuery({ query: '(max-width: 768px)' });
  const isLargeScreen = useMediaQuery({ query: '(max-width: 1012px)' });
  const isXLargeScreen = useMediaQuery({ query: '(max-width: 1280px)' });
  const isLessThan1296 = useMediaQuery({ query: '(max-width: 1296px)' });
  /*--------------------------------------------------------------------


  

  --------------------------------------------------------------------*/
  /* -------------------------------------------------------------------
  /* Preloaded Form Data -----------------------------------------------
  --------------------------------------------------------------------*/
  const [preloadedUserFormData, setPreloadedUserFormData] = useState([]);
  /*--------------------------------------------------------------------


  

  --------------------------------------------------------------------*/
  // Obtain 'authenticated' data that is fed around the application
  useEffect(() => {
    setIsAuthenticatedDataLoading(true);
    const getData = () => {
      dataHttpServices
        .getAllData()
        .then((returnedData) => {
          setIsAuthenticatedDataLoading(false);

          if (returnedData.branches.length === 0) {
            console.log('yeahh');
            throw new Error('No branches');
          }
          setOrganization(returnedData);
        })
        .catch((error) => {
          const logUserOut = () => {
            window.localStorage.removeItem('loggedWyreUser');
            setUserData(undefined);
          };

          if (error && error.message === 'No branches') {
            logUserOut();
          } else if (
            error &&
            error.response.data.message === 'UserId might not exist'
          ) {
            logUserOut();
          }
        });
    };

    if (userData) {
      getData();
    }
  }, [userData, userDateRange, parametersDataTimeInterval]);
  /*--------------------------------------------------------------------


  

  --------------------------------------------------------------------*/
  // Feed authenticated data into application
  useEffect(() => {
    // Ensure organization object is not empty
    if (
      Object.keys(organization).length > 0 &&
      organization.constructor === Object
    ) {
      // If nothing is checked, render organization's data
      // Otherwise, render data from checked items
      if (
        Object.keys(checkedItems).length === 0 &&
        checkedItems.constructor === Object
      ) {
        setRefinedRenderedData(getRefinedOrganizationData(organization));
        
      } else {
        const renderedDataArray = Object.values(renderedDataObjects);
        setRefinedRenderedData(getRenderedData(renderedDataArray));
      }
    }
  }, [organization, checkedItems, renderedDataObjects]);
      
  /*--------------------------------------------------------------------

    
  

  --------------------------------------------------------------------*/
  // Authenticate user based on login details saved to localstorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedWyreUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dataHttpServices.setUserId(user.data.id);
      dataHttpServices.setToken(user.data.token);
      setUserData(user);
      setToken(user.data.token);
      setUserId(user.data.id);
    }
  }, []);

  // State for Schedule Email Modal
  const [emailModalData, setEmailModalData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);


  const allDevices = []

  
  const [PasswordVisibility, setPasswordVisibility ] = useState(false)


  return (
    <CompleteDataContext.Provider
      value={{
        // Data Control
        organization: organization,
        refinedRenderedData: refinedRenderedData,
        renderedDataObjects: renderedDataObjects,
        setRenderedDataObjects: setRenderedDataObjects,
        checkedItems: checkedItems,
        setCheckedItems: setCheckedItems,
        checkedBranches: checkedBranches,
        setCheckedBranches: setCheckedBranches,
        checkedDevices: checkedDevices,
        setCheckedDevices: setCheckedDevices,
        numberOfCheckedItems: Object.keys(checkedItems).length,
        numberOfCheckedBranches: Object.keys(checkedBranches).length,
        isAuthenticatedDataLoading: isAuthenticatedDataLoading,

        // Nav and Sidebar Controls
        isNavOpen: isNavOpen,
        setIsNavOpen: setIsNavOpen,
        isSidebarOpen: isSidebarOpen,
        setIsSidebarOpen: setIsSidebarOpen,

        // Topbar Controls
        currentUrl: currentUrl,
        setCurrentUrl: setCurrentUrl,
        powerQualityUnit: powerQualityUnit,
        setPowerQualityUnit: setPowerQualityUnit,
        userDateRange: userDateRange,
        setUserDateRange: setUserDateRange,
        selectedDateRange: selectedDateRange,
        setSelectedDateRange: setSelectedDateRange,
        setParametersDataTimeInterval: setParametersDataTimeInterval,

        // Authentication
        isUserAdmin: isUserAdmin,
        setIsUserAdmin: setIsUserAdmin,
        username: username,
        setUsername: setUsername,
        password: password,
        setPassword: setPassword,
        userData: userData,
        setUserData: setUserData,
        token: token,
        setToken: setToken,
        userId: userId,
        setUserId: setUserId,

        // Media Queries
        useMediaQuery: useMediaQuery,
        isSmallScreen: isSmallScreen,
        isMediumScreen: isMediumScreen,
        isLargeScreen: isLargeScreen,
        isXLargeScreen: isXLargeScreen,
        isLessThan1296: isLessThan1296,

        //Schedule Email Modal
        emailModalData:emailModalData,
        setEmailModalData:setEmailModalData,
        isModalVisible: isModalVisible,
        setIsModalVisible: setIsModalVisible,

        // Preloaded Form Data
        preloadedUserFormData: preloadedUserFormData,
        setPreloadedUserFormData: setPreloadedUserFormData,

        // Password Toggle Visibility.
        PasswordVisibility:PasswordVisibility,
        setPasswordVisibility:setPasswordVisibility,
        
        
       allDevices: allDevices,
      }}
    >
      {props.children}
    </CompleteDataContext.Provider>
  );
};

// create consumer
const CompleteDataConsumer = CompleteDataContext.Consumer;

export { CompleteDataProvider, CompleteDataConsumer };
export default CompleteDataContext;
