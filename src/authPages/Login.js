/* eslint-disable no-restricted-globals */
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Spin, notification } from 'antd';
import { useForm, Controller } from 'react-hook-form';

import CompleteDataContext from '../Context';
import loginHttpServices from '../services/login';
import dataHttpServices from '../services/devices';

import HiddenInputLabel from '../smallComponents/HiddenInputLabel';
import OutlinedInput from '../smallComponents/OutlinedInput';
import SocialCluster from '../smallComponents/SocialCluster';

// import usePasswordToggle from '../smallComponents/usePasswordToggle'
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';



function Login() {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { setUserData } = useContext(CompleteDataContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const from = query.get('from') || 'dashboard';

  const { register, handleSubmit, control } = useForm();

  const onSubmit = async ({ username, password }, values) => {
    removeErrorMessage('')
    try {
      setIsAuthenticating(true);
      localStorage.clear();

      const user = await loginHttpServices.login2({
        username: username,
        password: password,
      });

      window.localStorage.setItem('loggedWyreUser', JSON.stringify(user.data.token));

      window.location.href = from;
      // dataHttpServices.setUserId(user.data.id);
      // dataHttpServices.setToken(user.data.token);
      // setUserData({ user, decodedUser: jwt(user.data.token)});
      setIsAuthenticating(false)
    } catch (exception) {
      setIsAuthenticating(false)
      setErrorMessage(exception.response.data.error);
      notification.error({
        message: "Invalid Username or Password"
      })
    }
  };
  const onSubmitt = (data, e) => console.log('success', data, e);
  // const onError = (errors, e) => console.log('error', errors, e);

  const onError = (errors, e) => {
    console.log('this is the errors', errors)
    const errorMsg = Object.values(errors)[0]?.message || '';
    setErrorMessage(errorMsg, errors)
  }

  const removeErrorMessage = (e) => {
    setErrorMessage(undefined);
  };

  return (
    <div className='auth-page-container'>
      <Spin spinning={isAuthenticating} >
        <form
          className='signup-login-contact-form'
          action='#'
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <h1 className='signup-login-heading first-heading--auth'>
            Welcome Back
          </h1>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='username' labelText='Username' />
            <OutlinedInput
              // defaultValue=''
              className='signup-login-contact-input '
              type='text'
              placeholder='Username'
              autoComplete='username'
              register={register('username').ref}
              onChange={removeErrorMessage}
              {...register("username", { minLength: 3, required: true })}
            />
          </p>

          <p className='outlined-input-container'>
            <HiddenInputLabel htmlFor='password' labelText='Password' />
            {/* <Controller
              // as={<Input.Password />}
              control={control}
              // defaultValue=''
              // rules={{
              //   required: true
              // }}
              // type='password'
              name='password'
              // id='password'
              // {...register('password')}
              render={({ field }) => (
                <Input.Password
                  className='signup-login-contact-input outlined-input'
                // type='password'
                // name='password'
                // id='password'
                // placeholder='Password'
                // autoComplete='new-password'
                // rules={{
                //   required: true
                // }}
                // value={value}
                // autoFocus={false}
                // onChange={(e) => onChange(e?.toString())}
                // onChange={removeErrorMessage}
                // iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}

                />
              )}

            /> */}

            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
                minLength: {
                  value: 5,
                  message: "password must be minimum of 5 characters",
                },
              }}
              onChange={removeErrorMessage}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input.Password
                  className='signup-login-contact-input outlined-input'
                  onBlur={onBlur}
                  selected={value}
                  onChange={onChange}
                  // onChange={removeErrorMessage}
                />
              )}
            />
          </p>

          <p className='signup-login-contact-error-message'>{errorMessage}</p>

          <div className='forgot-password-wrapper'>
            <Link className='forgot-password' to='/reset-password'>
              Forgot Password?
            </Link>
          </div>

          <button className='signup-login-contact-button'>Log in</button>
        </form>

        <SocialCluster />
      </Spin>
    </div>
  );
}

export default Login;






// end of script