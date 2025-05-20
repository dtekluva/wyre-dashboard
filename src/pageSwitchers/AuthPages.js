import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import Home from '../authPages/Home';
import About from '../authPages/About';
import Contact from '../authPages/Contact';
import Features from '../authPages/Features';
import Login from '../authPages/Login';
import SignUp from '../authPages/SignUp';
import ChangePassword from '../authPages/ChangePassword';
import ResetPassword from '../authPages/ResetPassword';
import Error from '../authPages/Error';

import ScrollToTop from '../helpers/ScrollToTop';

import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';
import ReportsAndMails from '../authPages/ReportsAndMails';

function AuthPages() {
  return (
    <div>
      <AuthHeader />

      <main className='auth-container'>
        <ScrollToTop>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/about' component={About} />
            <Route path='/contact' component={Contact} />
            <Route path='/get-reports' component={ReportsAndMails} />
            <Route path='/features' component={Features} />
            <Route path='/log-in' component={Login} />
            <Route path='/sign-up' component={SignUp} />
            <Route path='/change-password' component={ChangePassword} />
            <Route path='/reset-password' component={ResetPassword} />
            <Route component={Error} />
          </Switch>
        </ScrollToTop>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default AuthPages;
