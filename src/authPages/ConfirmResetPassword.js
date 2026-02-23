import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Spin, notification, Input } from 'antd';

import { confirmResetPasswordAction, validateResetTokenAction } from '../redux/actions/auth/auth.action';
import { validateResetTokenSuccess } from '../redux/actions/auth/actionCreators';
import HiddenInputLabel from '../smallComponents/HiddenInputLabel';
import SocialCluster from '../smallComponents/SocialCluster';

function ConfirmResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const dispatch = useDispatch();
  const {
    confirmResetPasswordLoading: loading,
    validateResetTokenLoading: validatingToken,
    resetTokenValidation: tokenValidation,
  } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const { handleSubmit, control } = useForm();

  useEffect(() => {
    if (tokenFromUrl) {
      dispatch(validateResetTokenAction(tokenFromUrl));
    } else {
      dispatch(validateResetTokenSuccess({ validatedToken: '', valid: false, reason: 'missing' }));
    }
  }, [tokenFromUrl, dispatch]);

  const tokenValid = tokenValidation?.validatedToken === tokenFromUrl && tokenValidation?.valid === true;
  const showInvalidLink = !tokenFromUrl || !tokenValid;
  const invalidReasonText = tokenValidation?.reason === 'expired' ? 'This link has expired or has already been used.' : 'This link is invalid or expired.';

  const onSubmit = async ({ new_password, confirm_password }) => {
    setErrorMessage(null);
    if (new_password !== confirm_password) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }
    const result = await dispatch(
      confirmResetPasswordAction({ token: tokenFromUrl, new_password })
    );
    if (result?.fulfilled) {
      setSuccess(true);
      notification.success({ message: result.message || 'Password reset successfully.' });
    } else {
      setErrorMessage(result?.message || 'Something went wrong.');
      notification.error({ message: result?.message || 'Request failed' });
    }
  };

  if (success) {
    return (
      <div className='auth-page-container'>
        <div className='signup-login-contact-form'>
          <h1 className='signup-login-heading first-heading--auth'>Password Reset</h1>
          <p className='reset-password-note'>Your password has been reset successfully. You can now log in with your new password.</p>
          <Link
            className='signup-login-contact-button'
            to='/log-in'
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '350px', margin: '0 auto', textDecoration: 'none' }}
          >
            Log in
          </Link>
        </div>
        <SocialCluster />
      </div>
    );
  }

  if (tokenFromUrl && (validatingToken || !tokenValidation)) {
    return (
      <div className='auth-page-container'>
        <div className='signup-login-contact-form'>
          <Spin spinning={true}>
            <h1 className='signup-login-heading first-heading--auth'>Checking link…</h1>
            <p className='reset-password-note'>Verifying your reset link…</p>
          </Spin>
        </div>
        <SocialCluster />
      </div>
    );
  }

  if (showInvalidLink && !validatingToken) {
    return (
      <div className='auth-page-container'>
        <div className='signup-login-contact-form'>
          <h1 className='signup-login-heading first-heading--auth'>Invalid or Expired Link</h1>
          <p className='reset-password-note'>
            {invalidReasonText} Please request a new password reset using the link below.
          </p>
          <Link
            className='signup-login-contact-button'
            to='/reset-password'
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '350px', margin: '0 auto', textDecoration: 'none' }}
          >
            Reset password
          </Link>
        </div>
        <SocialCluster />
      </div>
    );
  }

  return (
    <div className='auth-page-container'>
      <Spin spinning={loading}>
        <form
          className='signup-login-contact-form'
          action='#'
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className='signup-login-heading first-heading--auth'>Set New Password</h1>

          <p className='reset-password-note'>
            Enter your new password below. Use the eye icon to show and compare your entries.
          </p>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='new-password' labelText='New password' />
            <Controller
              control={control}
              name='new_password'
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input.Password
                  className='signup-login-contact-input outlined-input'
                  id='new-password'
                  placeholder='New password'
                  autoComplete='new-password'
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
            />
          </p>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='confirm-password' labelText='Confirm password' />
            <Controller
              control={control}
              name='confirm_password'
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input.Password
                  className='signup-login-contact-input outlined-input'
                  id='confirm-password'
                  placeholder='Confirm new password'
                  autoComplete='new-password'
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
            />
          </p>

          {errorMessage && <p className='signup-login-contact-error-message'>{errorMessage}</p>}

          <button className='signup-login-contact-button' type='submit' disabled={loading}>
            Set New Password
          </button>
        </form>

        <SocialCluster />
      </Spin>
    </div>
  );
}

export default ConfirmResetPassword;
