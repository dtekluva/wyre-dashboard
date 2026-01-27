import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import CompleteDataContext from '../Context';

import HeaderLink from '../smallComponents/HeaderLink';
import HeaderIcon from '../smallComponents/HeaderIcon';
import HeaderSublink from '../smallComponents/HeaderSublink';

import Logo from '../icons/Logo';
import Hamburger from '../icons/Hamburger';
import VerticalDots from '../icons/VerticalDots';
import MessageIcon from '../icons/MessageIcon';
import NotificationIcon from '../icons/NotificationIcon';
import ChevronDown from '../icons/ChevronDown';

import HeaderLinkWithDropdown from './groups/HeaderLinkWithDropdown';
import HeaderMobileAvatarWithDropdown from './groups/HeaderMobileAvatarWithDropdown';
import HeaderDesktopAvatarWithDropdown from './groups/HeaderDesktopAvatarWithDropdown';
import HeaderGroup1AndNav from './groups/HeaderGroup1AndNav';
import ProfileIcon from '../icons/ProfileIcon';
import OverviewIcon from '../icons/OverviewIcon';
import PadlockIcon from '../icons/PadlockIcon';
import SettingsIcon from '../icons/SettingsIcon';
import LogoutIcon from '../icons/LogoutIcon';
import { SCORE_CARD_EXCLUDE_CLIENTS, BESPOKE_ADD_LIST } from '../helpers/constants';
import DropdownButton from 'antd/lib/dropdown/dropdown-button';
import { Dropdown } from 'antd';
import BranchSwitcher from './BranchSwitcher';

function Header() {
  const {
    isNavOpen,
    setIsNavOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    setUserData,
    organization,
    currentUrl,
    userData,
    setEmailModalData,
  } = useContext(CompleteDataContext);

  const [isNavLinkDropdownOpen, setIsNavLinkDropdownOpen] = useState(false);
  const [isMobileAvatarMenuOpen, setIsMobileAvatarMenuOpen] = useState(false);
  const [isDesktopAvatarMenuOpen, setIsDesktopAvatarMenuOpen] = useState(false);

  const isReportPageOpen = currentUrl.includes('report');

  const { image: avatarImage, name: organisationName } = organization;
  const isOperator = userData.role_text === "OPERATOR";

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsNavOpen(false);
  };

  const toggleNavLinkDropdown = () => {
    setIsNavLinkDropdownOpen(!isNavLinkDropdownOpen);
  };

  const toggleMobileAvatarMenu = () => {
    setIsMobileAvatarMenuOpen(!isMobileAvatarMenuOpen);
  };

  const toggleDesktopAvatarMenu = () => {
    setIsDesktopAvatarMenuOpen(!isDesktopAvatarMenuOpen);
  };

  const toggleNavAndDropdown = () => {
    toggleNav();
    toggleNavLinkDropdown();
    toggleMobileAvatarMenu();
  };

  const logOut = () => {
    window.localStorage.removeItem('loggedWyreUser');
    setUserData(undefined);
    setEmailModalData(undefined)
  };

  // const isOrganisationSapio =
  //   organisationName && organisationName.includes('Sapio');

  var restricted_devices = ["Sapio", "Durosinmi", "Alpha"];

  const checkOrganizationHasAccess = ((organization) => {

    // run the tests against every element in the array
    if (organization) {
      return restricted_devices.some(el => organization.includes(el));
    }

  });


  const renderComp = () => {
    switch (userData.client_type) {

      case 'STANDARD':
        // all except billing and load overview
        return <>
          <HeaderLink onClick={toggleNav} url="/score-card" linkText="Score Card" />
          <HeaderLink onClick={toggleNav} url="/cost-tracker" linkText="Cost Tracker" />
          <HeaderLink onClick={toggleNav} url="/report" linkText="Report" />
          {/* <HeaderLink onClick={toggleNav} url="/breakers" linkText="Breakers" /> */}
        </>
      case 'RESELLER':
        // only dashboard, parameters and billing
        return <>
          <HeaderLink onClick={toggleNav} url="/billing" linkText="Billing" />
          {/* <HeaderLink onClick={toggleNav} url="/breakers" linkText="Breakers" /> */}
        </>
      case 'BESPOKE':
        return <>

          {
            BESPOKE_ADD_LIST.SCORE_CARD.includes(userData.client) &&
            <HeaderLink onClick={toggleNav} url="/score-card" linkText="Score Card"
            />
          }
          {
            BESPOKE_ADD_LIST.COST_TRACKER.includes(userData.client) &&
            <HeaderLink onClick={toggleNav} url="/cost-tracker" linkText="Cost Tracker" />
          }
          {/* {
            BESPOKE_ADD_LIST.COST_TRACKER.includes(userData.client) &&
            <HeaderLink onClick={toggleNav} url="/breakers" linkText="Breakers" />
          }  */}
          {
            BESPOKE_ADD_LIST.REPORT.includes(userData.client) &&
            <HeaderLink onClick={toggleNav} url="/report" linkText="Report" />
          }
          {
            BESPOKE_ADD_LIST.BILLING.includes(userData.client) &&
            <HeaderLink onClick={toggleNav} url="/billing" linkText="Billing" />
          }
          {
            BESPOKE_ADD_LIST.BILLING.includes(userData.client) &&
              <HeaderLink onClick={toggleNav} url="/alerts-and-alarms" linkText="Alerts and Alarms" />
          }
        </>
      default:
        <HeaderLink onClick={toggleNav} url="/billing" linkText="Billing" />
    }
  }


  const doesUserHaveAccess =
    organisationName && checkOrganizationHasAccess(organisationName);

  return (
    <header
      className={
        // isReportPageOpen ? 'header report-page-header' : 
        'header'
      }

    >
      <HeaderGroup1AndNav className="header-group-1-and-nav">
        {' '}
        <div className="header-group-1">
          <button
            type="button"
            className="headerMenu-button dotmenu-button h-hidden-medium-up"
            onClick={toggleSidebar}
          >
            <VerticalDots className="headerMenu-button__image dotmenu-button__image" />
          </button>

          {/* <div className="header-logo-container">
            <Link className="header-logo" to="/">
              <Logo
                className={
                  // isReportPageOpen
                  //   ? 'header-logo__image'
                  //   : 
                  'header-logo__image header- h-white-fill-medium-up'
                }
              />
            </Link>
          </div> */}

          <button
            type="button"
            className="headerMenu-button hamburger-button h-hidden-1296-up"
            onClick={toggleNav}
          >
            <Hamburger className="headerMenu-button__image hamburger-button__image" />
          </button>
        </div>
        <nav
          className={isNavOpen ? 'header-nav' : 'header-nav h-hidden-1296-down'}
        >
          <ul className="header-nav-list">
            {userData.is_solar_customer === false ? (
              <>
                <HeaderLink onClick={toggleNav} url="/" linkText="Dashboard" />
                <HeaderLink onClick={toggleNav} url="/diesel-overview" linkText="Diesel Overview" />
                <HeaderLink onClick={toggleNav} url="/solar-overview" linkText="Solar Overview" />

                {/* {!doesUserHaveAccess && ( */}
                {/* {organization && !SCORE_CARD_EXCLUDE_CLIENTS.includes(organization.name)
          &&
          <HeaderLink
            onClick={toggleNav}
            url="/score-card"
            linkText="Score Card"
          />
        } */}
                {/* )} */}

                <HeaderLinkWithDropdown
                  className="header-nav-list__item header-link-with-dropdown"
                  setIsNavLinkDropdownOpen={setIsNavLinkDropdownOpen}
                >
                  <button
                    type="button"
                    className="header-link-dropdown-button"
                    onClick={toggleNavLinkDropdown}
                  >
                    Parameters
                    <ChevronDown className="header-link-dropdown-icon" />
                  </button>

                  <ul
                    className={
                      isNavLinkDropdownOpen
                        ? 'header-sublinks-list'
                        : 'header-sublinks-list h-hide'
                    }
                  >
                    <HeaderSublink
                      onClick={toggleNavAndDropdown}
                      url="/parameters/energy-consumption"
                      linkText="Energy Consumption"
                    />
                    <HeaderSublink
                      onClick={toggleNavAndDropdown}
                      url="/parameters/power-quality"
                      linkText="Power Quality"
                    />
                    <HeaderSublink
                      onClick={toggleNavAndDropdown}
                      url="/parameters/power-demand"
                      linkText="Power Demand"
                    />

                    {/* {userData.client_type !== 'RESELLER' && (
              <HeaderSublink
                onClick={toggleNavAndDropdown}
                url="/parameters/time-of-use"
                linkText="Time of Use"
              />
            )} */}

                    <HeaderSublink
                      onClick={toggleNavAndDropdown}
                      url="/parameters/last-reading"
                      linkText="Last Reading"
                    />
                  </ul>
                </HeaderLinkWithDropdown>

                {/* <HeaderLink
          onClick={toggleNav}
          url="/report"
          linkText="Report"
        /> */}

                {renderComp()}

                {isOperator ? (
                  <HeaderLink
                    onClick={toggleNav}
                    url="/alerts-and-alarms"
                    linkText="Alerts and Alarms"
                  />
                ) : (
                  ''
                )}

                {/* {!doesUserHaveAccess && ( */}
                {/* {organization && !SCORE_CARD_EXCLUDE_CLIENTS.includes(organization.name)
          &&
          <HeaderLink
            onClick={toggleNav}
            url="/cost-tracker"
            linkText="Cost Tracker"
          />
        } */}
                {/* )} */}

                {/* <HeaderLink onClick={toggleNav} url="/billing" linkText="Billing" /> */}

                {/* {!doesUserHaveAccess && (
            <HeaderLink
              onClick={toggleNav}
              url="/dashboard"
              // url='/messages'
              linkText="Messages"
            />
          )} */}
              </>
            ) : (
              <>
                <li className="header-nav-list__item h-hidden-1296-up">
                  <HeaderIcon
                    onClick={toggleNav}
                    count={0}
                    countClassName="header-icon__count"
                  >
                    <MessageIcon className="header-icon__image" />
                  </HeaderIcon>
                </li>

                <li className="header-nav-list__item h-hidden-1296-up">
                  <HeaderIcon
                    onClick={toggleNav}
                    count={0}
                    countClassName="header-icon__count"
                  >
                    <NotificationIcon className="header-icon__image" />
                  </HeaderIcon>
                </li>
              </>
            )}

            {/* ===== MOBILE AVATAR DROPDOWN ===== */}
            <HeaderMobileAvatarWithDropdown
              className="header-nav-list__item header-avater-container h-hidden-1296-up"
              setIsMobileAvatarMenuOpen={setIsMobileAvatarMenuOpen}
            >
              <button
                type="button"
                onClick={toggleMobileAvatarMenu}
                className="header-avatar"
              >
                <img
                  className="header-avatar__image"
                  src={
                    organisationName ? `https://backend.wyreng.com${avatarImage}` : '/wyreLogo.png'
                  }
                  alt={
                    'Avatar'
                  }
                />
              </button>

              <ul
                className={
                  isMobileAvatarMenuOpen
                    ? 'header-sublinks-list'
                    : 'header-sublinks-list h-hide'
                }
              >
                <li className="header-sublinks-list__item avatar-sublink-item">
                  <Link
                    className="header-sublink avatar-sublink"
                    onClick={toggleNavAndDropdown}
                    to="/branches/user-form"
                  >
                    <ProfileIcon /> <span>Personal Data</span>
                  </Link>
                </li>

                <li className="header-sublinks-list__item avatar-sublink-item">
                  <Link
                    className="header-sublink avatar-sublink"
                    onClick={toggleNavAndDropdown}
                    to="/dashboard"
                  >
                    <OverviewIcon /> <span>Overview</span>
                  </Link>
                </li>

                <li className="header-sublinks-list__item avatar-sublink-item">
                  <Link
                    className="header-sublink avatar-sublink"
                    onClick={toggleNavAndDropdown}
                    to="/dashboard"
                  >
                    <PadlockIcon /> <span>Password</span>
                  </Link>
                </li>

                {/* <li className="header-sublinks-list__item avatar-sublink-item">
          <Link
            className="header-sublink avatar-sublink"
            onClick={toggleNavAndDropdown}
            to="/alerts-and-alarms"
          >
            <SettingsIcon /> <span>Alerts and Alarms</span>
          </Link>
        </li> */}

                <li className="header-sublinks-list__item avatar-sublink-item">
                  <Link
                    className="header-sublink avatar-sublink"
                    onClick={() => {
                      logOut();
                      toggleNavAndDropdown();
                    }}
                    to="/"
                  >
                    <LogoutIcon /> <span>Log Out</span>
                  </Link>
                </li>
              </ul>
            </HeaderMobileAvatarWithDropdown>
          </ul>
        </nav>
      </HeaderGroup1AndNav>

      <div className="all-header-icons h-hidden-1296-down">
        <HeaderIcon
          count={0}
          iconClassName="message-icon"
          countClassName="header-icon__count"
        >
          <MessageIcon className="header-icon__image" />
        </HeaderIcon>

        <HeaderIcon
          count={0}
          iconClassName="notification-icon"
          countClassName="header-icon__count"
        >
          <NotificationIcon className="header-icon__image" />
        </HeaderIcon>

        <HeaderDesktopAvatarWithDropdown
          setIsDesktopAvatarMenuOpen={setIsDesktopAvatarMenuOpen}
        >
          <button
            type="button"
            onClick={toggleDesktopAvatarMenu}
            className="header-avatar"
          >
            <img
              className="header-avatar__image"
              src={organisationName ? `https://backend.wyreng.com${avatarImage}` : '/wyreLogo.png'}
              alt={
                organisationName ? `Avatar for ${organisationName}` : 'Avatar'
              }
            />
          </button>

          <ul
            className={
              isDesktopAvatarMenuOpen
                ? 'header-sublinks-list avatar-sublinks-list'
                : 'header-sublinks-list avatar-sublinks-list h-hide'
            }
          >
            <li className="header-sublinks-list__item avatar-sublink-item">
              <Link
                className="header-sublink avatar-sublink"
                to="/branches/user-form"
              >
                <ProfileIcon /> <span>Personal Data</span>
              </Link>
            </li>

            <li className="header-sublinks-list__item avatar-sublink-item">
              <Link
                className="header-sublink avatar-sublink"
                to="/dashboard"
              // to='/branches'
              >
                <OverviewIcon /> <span>Overview</span>
              </Link>
            </li>

            <li className="header-sublinks-list__item avatar-sublink-item">
              <Link
                className="header-sublink avatar-sublink"
                to="/password"
              // to='/password'
              >
                <PadlockIcon /> <span>Password</span>
              </Link>
            </li>

            {/* <li className="header-sublinks-list__item avatar-sublink-item">
              <Link
                className="header-sublink avatar-sublink"
                to="/alerts-and-alarms"
              >
                <SettingsIcon /> <span>Alerts and Alarms</span>
              </Link>
            </li> */}

            <li className="header-sublinks-list__item avatar-sublink-item">
              <Link
                onClick={logOut}
                className="header-sublink avatar-sublink"
                to="/"
              >
                <LogoutIcon /> <span>Log Out</span>
              </Link>
            </li>
          </ul>
        </HeaderDesktopAvatarWithDropdown>
      </div>
    </header>
  );
}

export default Header;