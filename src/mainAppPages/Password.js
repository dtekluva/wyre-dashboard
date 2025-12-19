import React, { useEffect, useContext } from 'react';
import { Button, Form, Input, notification, Spin } from 'antd';
import CompleteDataContext from '../Context';
import { changePassword } from '../redux/actions/auth/auth.action';

import BreadCrumb from '../components/BreadCrumb';


import ErrorIcon from '../icons/ErrorIcon';
import { connect } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/password', name: 'Password', id: 2 },
];

const openNotificationWithIcon = (type, title = 'Password Updated', message = 'Your password has been successfully updated') => {
  notification[type]({
    message: title,
    description: message,
  });
};

function Password({ match, auth }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const onSubmit = async ({ oldPassword, newPassword1, newPassword2 }) => {
    console.log(oldPassword, newPassword1, newPassword2);
    setLoading(true)
    if (localStorage.loggedWyreUser) {
      const user = JSON.parse(localStorage.loggedWyreUser);
      const userData = jwtDecode(user.access);
      const requestData = { username: userData.username, password: oldPassword, new_password: newPassword1 }
      const change = await changePassword(requestData)
      if (change.fulfilled) {
        openNotificationWithIcon('success');
        form.resetFields();
      } else {
        openNotificationWithIcon('error', 'Password change failed', change.message);
      }
    }
    setLoading(false)

  };

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />

      </div>
      <Spin spinning={loading}>
        <div className="password-page-container">
          <h1 className="center-main-heading">Password</h1>

          <Form
            form={form}
            className="password-form"
            onFinish={onSubmit}
          >
            <div className="">
              <Form.Item
                style={{ width: '100%' }}
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: 'old password is required',
                  }
                ]}
              >
                <div className="password-input-container new-password-container">
                  <label className="generic-input-label" htmlFor="old-password">
                    Old Password
                  </label>
                  <Input.Password
                    type="password"
                    autoFocus
                  />
                </div>
              </Form.Item>
              <Form.Item style={{ width: '100%' }}
                name="newPassword1"
                rules={[
                  {
                    required: true,
                    message: 'new password is required',
                  }, {
                    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    message: 'Please enter a valid password',
                  }
                ]}
              >
                <div className="password-input-container new-password-container h-first">
                  <label className="generic-input-label" htmlFor="new-password-1">
                    New Password
                  </label>
                  <Input.Password
                    type="password"
                  />
                </div>
              </Form.Item>
              <Form.Item style={{ width: '100%' }}
                name="newPassword2"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword1') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <div className="password-input-container new-password-container">
                  <label className="generic-input-label" htmlFor="new-password-2">
                    Re-enter New Password
                  </label>
                  <Input.Password
                    type="password"
                  />
                </div>
              </Form.Item>
            </div>

            <p className="password-error-message">
              <ErrorIcon
              />
              <span
              >
                Passwords must include a number, a special character, a lowercase and uppercase letter.
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
      </Spin>
    </>
  );
}

const mapDispatchToProps = {

}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(Password);

