import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Input, notification } from 'antd';
import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';


import ErrorIcon from '../icons/ErrorIcon';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/password', name: 'Password', id: 2 },
];

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Password Updated',
    description: `Your password has been successfully updated`,
  });
};

function Password({ match }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const { register, handleSubmit, reset, errors } = useForm();

  const onSubmit = ({ oldPassword, newPassword1, newPassword2 }) => {
    console.log(oldPassword, newPassword1, newPassword2);

    openNotificationWithIcon('success');

    reset();
  };

  const isDefaultErrorMessageRed = errors.newPassword2 || errors.newPassword2;

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
        
      </div>

      <div className="password-page-container">
        <h1 className="center-main-heading">Password</h1>

        <Form
          action="#"
          className="password-form"
          onFinish={handleSubmit(onSubmit)}
        >
          <div className="password-input-container old-password-container">
            <label className="generic-input-label" htmlFor="old-password">
              Old Password
            </label>
            <Input.Password
              // className="generic-input old-password-input"
              type="password"
              name="oldPassword"
              id="old-password"
              ref={register}
              required
              autoFocus
            />
          </div>

          <div className="new-passwords-container">
            <div className="password-input-container new-password-container h-first">
              <label className="generic-input-label" htmlFor="new-password-1">
                New Password
              </label>
              <Input.Password
                // className="generic-input"
                type="password"
                name="newPassword1"
                // id="new-password-1"
                ref={register({
                  required: true,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                })}
                required
              />
            </div>
            <div className="password-input-container new-password-container">
              <label className="generic-input-label" htmlFor="new-password-2">
                Re-enter New Password
              </label>
              <Input.Password
                // className="generic-input"
                type="password"
                name="newPassword2"
                // id="new-password-2"
                ref={register({
                  required: true,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                })}
                required
              />
            </div>
          </div>

          <p className="password-error-message">
            <ErrorIcon
              className={
                isDefaultErrorMessageRed
                  ? 'password-error-icon h-red-icon'
                  : 'password-error-icon'
              }
            />

            <span
              className={
                isDefaultErrorMessageRed
                  ? 'password-error-text h-red-text'
                  : 'password-error-text'
              }
            >
              Passwords must include a number, a lowercase and uppercase letter.
              They should also be a minimum of 8 characters.
            </span>
          </p>

          <button className="generic-submit-button change-password-button">
            Change Password
          </button>
        </Form>
      </div>
    </>
  );
}

export default Password;
