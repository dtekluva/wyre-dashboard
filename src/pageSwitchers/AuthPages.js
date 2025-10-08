import React from 'react';
import { Route, Routes } from 'react-router-dom';

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

function AuthPages() {

  return (
    <div>
      <AuthHeader />

      <main className='auth-container'>
        {/* <ScrollToTop> */}
          <Routes> 
            <Route path="/" element={<Login to="/" replace />} />           
            <Route path='/about' element={<About to="/about" /> } />
            <Route path='/contact' element={<Contact to="/contact" /> } />
            <Route path='/features' element={<Features to="/features" />} />
            <Route path='/log-in' element={<Login to="/log-in" />}  />
            <Route path='/sign-up' element={<SignUp to="/sign-up" /> } />
            <Route path='/change-password' element={<ChangePassword to="/change-password" /> } />
            <Route path='/reset-password' element={<ResetPassword to="/reset-password" /> } />
            <Route path="*" element={<Error />} />
          </Routes>
        {/* </ScrollToTop> */}
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default AuthPages;

