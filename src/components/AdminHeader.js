import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import CompleteDataContext from '../Context';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import HeaderLink from '../smallComponents/HeaderLink';
import HeaderIcon from '../smallComponents/HeaderIcon';
import HeaderSublink from '../smallComponents/HeaderSublink';

// import Logo from '../icons/Logo';
import Hamburger from '../icons/Hamburger';
import VerticalDots from '../icons/VerticalDots';
import MessageIcon from '../icons/MessageIcon';
import NotificationIcon from '../icons/NotificationIcon';
import ChevronDown from '../icons/ChevronDown';

import avatar from '../images/avatar.png';

import HeaderLinkWithDropdown from './groups/HeaderLinkWithDropdown';
import HeaderMobileAvatarWithDropdown from './groups/HeaderMobileAvatarWithDropdown';
import HeaderDesktopAvatarWithDropdown from './groups/HeaderDesktopAvatarWithDropdown';
import HeaderGroup1AndNav from './groups/HeaderGroup1AndNav';
import LogoutIcon from '../icons/LogoutIcon';
import { logoutUser } from '../redux/actions/auth/actionCreators';
import LatestLogo from '../icons/LatestLogo';

function Header() {
  const {
    isNavOpen,
    setIsNavOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    organization
  } = useContext(CompleteDataContext);

  const [isNavLinkDropdownOpen, setIsNavLinkDropdownOpen] = useState(false);
  const [isMobileAvatarMenuOpen, setIsMobileAvatarMenuOpen] = useState(false);
  const [isDesktopAvatarMenuOpen, setIsDesktopAvatarMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const history = useHistory();

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
    dispatch(logoutUser());
    window.localStorage.removeItem('loggedWyreUser');


    // Go home
    history.push('/');

    window.href = '/';
    // Refresh page
    // history.go(0);
  };

  const { image: orgImage } = organization

  return (
    <header className='header h-no-linear-gradient'>
      <HeaderGroup1AndNav className='header-group-1-and-nav'>
        {' '}
        <div className='header-group-1'>
          <button
            type='button'
            className='headerMenu-button dotmenu-button h-hidden-medium-up'
            onClick={toggleSidebar}
          >
            <VerticalDots className='headerMenu-button__image dotmenu-button__image' />
          </button>

          <div className='admin-header-logo-container'>
            {/* <Link className='header-logo' to='/'>
              <Logo className='header-logo__image' />
            </Link> */}
            <Link className='header-logo--auth' to='/'>
              <LatestLogo className='header-logo-latest-image--auth' />
            </Link>
          </div>

          <button
            type='button'
            className='headerMenu-button hamburger-button h-hidden-1296-up'
            onClick={toggleNav}
          >
            <Hamburger className='headerMenu-button__image hamburger-button__image' />
          </button>
        </div>
        <nav
          className={isNavOpen ? 'header-nav' : 'header-nav h-hidden-1296-down'}
        >
          <ul className='header-nav-list'>
            <HeaderLink onClick={toggleNav} url='/' linkText='Admin Overview' />

            <HeaderLinkWithDropdown
              className='header-nav-list__item header-link-with-dropdown'
              setIsNavLinkDropdownOpen={setIsNavLinkDropdownOpen}
            >
              <button
                type='button'
                className='header-link-dropdown-button'
                onClick={toggleNavLinkDropdown}
              >
                Manage
                <ChevronDown className='header-link-dropdown-icon' />
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
                  url='/view-client'
                  linkText='View Client'
                />
                <HeaderSublink
                  onClick={toggleNavAndDropdown}
                  url='/view-branches'
                  linkText='View Branches'
                />
                <HeaderSublink
                  onClick={toggleNavAndDropdown}
                  url='/view-devices'
                  linkText='View Devices'
                />
              </ul>
            </HeaderLinkWithDropdown>

            {/* <HeaderLink
              onClick={toggleNav}
              url='/messages'
              linkText='Messages'
            /> */}

            <li className='header-nav-list__item h-hidden-1296-up'>
              <HeaderIcon
                onClick={toggleNav}
                count={4}
                countClassName='header-icon__count'
              >
                <MessageIcon className='header-icon__image' />
              </HeaderIcon>
            </li>

            <li className='header-nav-list__item h-hidden-1296-up'>
              <HeaderIcon
                onClick={toggleNav}
                count={2}
                countClassName='header-icon__count'
              >
                <NotificationIcon className='header-icon__image' />
              </HeaderIcon>
            </li>

            <HeaderMobileAvatarWithDropdown
              className='header-nav-list__item header-avater-container h-hidden-1296-up'
              setIsMobileAvatarMenuOpen={setIsMobileAvatarMenuOpen}
            >
              <button
                type='button'
                onClick={toggleMobileAvatarMenu}
                className='header-avatar'
              >
                <img src={orgImage} alt='' />
              </button>

              <ul
                className={
                  isMobileAvatarMenuOpen
                    ? 'header-sublinks-list'
                    : 'header-sublinks-list h-hide'
                }
              >
                <li className='header-sublinks-list__item avatar-sublink-item'>
                  <Link
                    className='header-sublink avatar-sublink'
                    onClick={() => {
                      logOut();
                      toggleNavAndDropdown();
                    }}
                    to='/'
                  >
                    <LogoutIcon /> <span>Log Out</span>
                  </Link>
                </li>
              </ul>
            </HeaderMobileAvatarWithDropdown>
          </ul>
        </nav>
      </HeaderGroup1AndNav>

      <div className='all-header-icons h-hidden-1296-down'>
        <HeaderIcon
          count={4}
          iconClassName='message-icon'
          countClassName='header-icon__count'
        >
          <MessageIcon className='header-icon__image' />
        </HeaderIcon>

        <HeaderIcon
          count={2}
          iconClassName='notification-icon'
          countClassName='header-icon__count'
        >
          <NotificationIcon className='header-icon__image' />
        </HeaderIcon>

        <HeaderDesktopAvatarWithDropdown
          setIsDesktopAvatarMenuOpen={setIsDesktopAvatarMenuOpen}
        >
          <button
            type='button'
            onClick={toggleDesktopAvatarMenu}
            className='header-avatar'
          >
            <img src={avatar} alt='' />
          </button>

          <ul
            className={
              isDesktopAvatarMenuOpen
                ? 'header-sublinks-list avatar-sublinks-list'
                : 'header-sublinks-list avatar-sublinks-list h-hide'
            }
          >
            <li className='header-sublinks-list__item avatar-sublink-item'>
              <Link
                onClick={logOut}
                className='header-sublink avatar-sublink'
                to='/'
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
