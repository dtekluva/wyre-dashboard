import { Route, Routes } from 'react-router-dom';

// import Home from '../authPages/Home';
import About from '../authPages/About';
import Contact from '../authPages/Contact';
import Features from '../authPages/Features';
import Login from '../authPages/Login';
import SignUp from '../authPages/SignUp';
import ChangePassword from '../authPages/ChangePassword';
import ResetPassword from '../authPages/ResetPassword';
import ConfirmResetPassword from '../authPages/ConfirmResetPassword';
import Error from '../authPages/Error';

import AuthHeader from '../components/AuthHeader';
import ForceLogin from '../mainAppPages/ForceLogin';

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
            <Route path='/force-login' element={<ForceLogin />} />
            <Route path='/change-password' element={<ChangePassword to="/change-password" /> } />
            <Route path='/reset-password' element={<ResetPassword to="/reset-password" /> } />
            <Route path='/confirm-reset-password' element={<ConfirmResetPassword to="/confirm-reset-password" /> } />
            <Route path="*" element={<Error />} />
          </Routes>
        {/* </ScrollToTop> */}
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default AuthPages;
