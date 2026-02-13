import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Spin, notification } from 'antd';

import { confirmResetPasswordAction } from '../redux/actions/auth/auth.action';
import HiddenInputLabel from '../smallComponents/HiddenInputLabel';
import OutlinedInput from '../smallComponents/OutlinedInput';
import SocialCluster from '../smallComponents/SocialCluster';

function ConfirmResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const dispatch = useDispatch();
  const { confirmResetPasswordLoading: loading } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { token: tokenFromUrl },
  });

  const onSubmit = async ({ token, new_password, confirm_password }) => {
    setErrorMessage(null);
    if (!token?.trim()) {
      setErrorMessage('Reset token is required.');
      return;
    }
    if (new_password !== confirm_password) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }
    const result = await dispatch(
      confirmResetPasswordAction({ token: token.trim(), new_password })
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
          <Link className='signup-login-contact-button' to='/log-in' style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
            Log in
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
            Enter the reset token from your email and your new password below.
          </p>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='confirm-reset-token' labelText='Reset token' />
            <OutlinedInput
              className='signup-login-contact-input'
              type='text'
              name='token'
              id='confirm-reset-token'
              placeholder='Paste token from email (or use link with ?token=...)'
              autoComplete='one-time-code'
              required={true}
              autoFocus={!tokenFromUrl}
              register={register('token').ref}
              {...register('token', { required: true })}
            />
          </p>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='new-password' labelText='New password' />
            <OutlinedInput
              className='signup-login-contact-input'
              type='password'
              name='new_password'
              id='new-password'
              placeholder='New password'
              autoComplete='new-password'
              required={true}
              autoFocus={!!tokenFromUrl}
              register={register('new_password').ref}
              {...register('new_password', { required: true })}
            />
          </p>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='confirm-password' labelText='Confirm password' />
            <OutlinedInput
              className='signup-login-contact-input'
              type='password'
              name='confirm_password'
              id='confirm-password'
              placeholder='Confirm new password'
              autoComplete='new-password'
              required={true}
              register={register('confirm_password').ref}
              {...register('confirm_password', { required: true })}
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
