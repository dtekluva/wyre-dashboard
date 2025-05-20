import React, { useContext, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CompleteDataContext from "../Context";
import LatestLogo from "../icons/LatestLogo";
import Logo from "../icons/Logo";

import avatar from "../images/logo.png";
import { fetchSideBar } from "../redux/actions/sidebar/sidebar.action";

import SidebarOrganization from "./SidebarOrganization";

function Sidebar({ fetchSideBar: fetchSideBarData }) {
  const sideBarData = useSelector((state) => state.sideBar.sideBarData);

  useEffect(() => {
    if (!sideBarData || !sideBarData.name) {
      fetchSideBarData();
    }
  }, []);

  const { isSidebarOpen, currentUrl } = useContext(CompleteDataContext);

  const isReportPageOpen = currentUrl.includes("report");

  // Ensure data is loaded before sidebar is rendered
  const organizationComponent = sideBarData.name && (
    <SidebarOrganization orgData={sideBarData} />
  );

  return (
    <div
      className={
        // isReportPageOpen
        //   ? 'h-hide'
        //   :
        isSidebarOpen ? "sidebar" : "sidebar h-hidden-medium-down"
      }
    >
      <div className="header-logo-container">
        <Link className="header-logo" to="/">
          {/* <Logo
            className={
              // isReportPageOpen
              //   ? 'header-logo__image'
              //   : 
              'header-logo__image header- h-white-fill-medium-up'
            }
          /> */}
          <LatestLogo
            fill="white"
            // className={
            //   // isReportPageOpen
            //   //   ? 'header-logo__image'
            //   //   :
            //   'header-logo__image header- h-white-fill-medium-up'
            // }
          />
          {/* <img src={avatar} alt='' /> */}
        </Link>
      </div>
      {<ul className="sidebar-org-container">{organizationComponent}</ul>}
    </div>
  );
}

const mapDispatchToProps = {
  fetchSideBar,
};

export default connect(null, mapDispatchToProps)(Sidebar);
