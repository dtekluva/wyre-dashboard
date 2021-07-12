import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CompleteDataContext from '../Context';

import AuthHeaderLink from '../smallComponents/AuthHeaderLink';

import Logo from '../icons/Logo';
import Hamburger from '../icons/Hamburger';

function AuthHeader() {
  const { isNavOpen, setIsNavOpen } = useContext(CompleteDataContext);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className='header--auth'>
      <div className='header-logo-and-hamburger--auth'>
        <Link className='header-logo--auth' to='/'>
          <Logo className='header-logo-image--auth' />
        </Link>

        <button
          className='hamburger-button--auth h-hidden-medium-up'
          onClick={toggleNav}
        >
          <Hamburger className='hamburger-button__image--auth' />
        </button>
      </div>

      <nav
        className={
          isNavOpen
            ? 'header-nav--auth'
            : 'header-nav--auth h-hidden-medium-down'
        }
      >
        <ul className='header-links-list--auth'>
          <AuthHeaderLink onClick={toggleNav} url='#' linkText='About' />
          <AuthHeaderLink onClick={toggleNav} url='#' linkText='Features' />
          <AuthHeaderLink
            onClick={toggleNav}
            url='/contact'
            linkText='Contact'
          />
          <AuthHeaderLink onClick={toggleNav} url='/log-in' linkText='Log in' />
          <li className='header-nav-list__item--auth'>
            <Link
              onClick={toggleNav}
              className='header-short-button--auth header-link--auth'
              to='/sign-up'
            >
              Get Started
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default AuthHeader;
