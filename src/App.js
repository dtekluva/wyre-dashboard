import React, { useContext } from "react";
import CompleteDataContext from "./Context";

import MainAppPages from "./pageSwitchers/MainAppPages";
import AuthPages from "./pageSwitchers/AuthPages";
import AdminPages from "./pageSwitchers/AdminPages";
import { useSelector } from "react-redux";
import AiChat from "./components/aiChat/AiChat";

function App() {
  const { userData, isUserAdmin, isAuthenticatedDataLoading } =
    useContext(CompleteDataContext);
  const uiSettings = useSelector((state) => state.setting.uiSettings);

  return (
    <>
      {isUserAdmin ? (
        <>
          {/* <AiChat /> */}
          <AdminPages />
        </>
      ) : userData ? (
        <>
          <AiChat />
          <MainAppPages
            isLoading={isAuthenticatedDataLoading}
            uiSettings={uiSettings}
          />
        </>
      ) : (
        <AuthPages />
      )}
    </>
  );
}

export default App;
