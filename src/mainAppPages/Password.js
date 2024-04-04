import React, { useEffect, useContext } from 'react';
// import { useForm } from 'react-hook-form';
import { Button, Form, Input, notification } from 'antd';
import CompleteDataContext from '../Context';
import { changePassword } from '../redux/actions/auth/auth.action';

import BreadCrumb from '../components/BreadCrumb';


import ErrorIcon from '../icons/ErrorIcon';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';

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

function Password({ match, changePassword: changeUserPassword, auth }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);
  const [form] = Form.useForm();
  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  // const { form, register, handleSubmit, reset, errors } = useForm();

  const onSubmit = async ({ oldPassword, newPassword1, newPassword2 }) => {
    console.log(oldPassword, newPassword1, newPassword2);



    if (localStorage.loggedWyreUser) {
      const user = JSON.parse(localStorage.loggedWyreUser);
      const userData = jwtDecode(user.access);
      const requestData = { username: userData.username, password: oldPassword, new_password: newPassword1 }
      console.log('thsi si the auth informa tion snd', jwtDecode(user.access))
      const change = await changeUserPassword(requestData)
      console.log('this is the change that was given ')
      // log user out here
    }
    openNotificationWithIcon('success');

    // reset();
  };

  // const isDefaultErrorMessageRed = errors.newPassword2 || errors.newPassword2;

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />

      </div>

      <div className="password-page-container">
        <h1 className="center-main-heading">Password</h1>

        <Form
          form={form}
          className="password-form"
          onFinish={onSubmit}
        >
          <Form.Item
          
          name="oldPassword"
          >
            <div className="password-input-container old-password-container">
              <label className="generic-input-label" htmlFor="old-password">
                Old Password
              </label>
              <Input.Password
                // className="generic-input old-password-input"
                type="password"
                // name="oldPassword"
                id="old-password"
                // ref={register}
                required
                autoFocus
              />
            </div>
          </Form.Item>

          <div className="new-passwords-container">
            <Form.Item style={{ width: '100%' }}
            name="newPassword1"
            >
              <div className="password-input-container new-password-container h-first">
                <label className="generic-input-label" htmlFor="new-password-1">
                  New Password
                </label>
                <Input.Password
                  // className="generic-input"
                  type="password"
                  // id="new-password-1"
                  // ref={register({
                  //   required: true,
                  //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  // })}
                  required
                />
              </div>
            </Form.Item>
            <Form.Item style={{ width: '100%' }}
              name="newPassword2"
            >
              <div className="password-input-container new-password-container">
                <label className="generic-input-label" htmlFor="new-password-2">
                  Re-enter New Password
                </label>
                <Input.Password
                  // className="generic-input"
                  type="password"
                  // id="new-password-2"
                  // ref={register({
                  //   required: true,
                  //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  // })}
                  required
                />
              </div>
            </Form.Item>
          </div>

          <p className="password-error-message">
            <ErrorIcon
            // className={
            //   isDefaultErrorMessageRed
            //     ? 'password-error-icon h-red-icon'
            //     : 'password-error-icon'
            // }
            />

            <span
            // className={
            //   isDefaultErrorMessageRed
            //     ? 'password-error-text h-red-text'
            //     : 'password-error-text'
            // }
            >
              Passwords must include a number, a lowercase and uppercase letter.
              They should also be a minimum of 8 characters.
            </span>
          </p>
          <Form.Item>
            <Button htmlType="submit" className="generic-submit-button change-password-button">
              Change Password
            </Button>
          </Form.Item>
        </Form >
      </div >
    </>
  );
}

const mapDispatchToProps = {
  changePassword
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(Password);

