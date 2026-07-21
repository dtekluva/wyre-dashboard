import React, { useEffect, useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { DatePicker, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import CompleteDataContext from '../Context';

import branchesHttpServices from '../services/userBranches';

import BreadCrumb from '../components/BreadCrumb';


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/branches', name: 'Branches', id: 2 },
  { url: '/branches/user-form', name: 'User Form', id: 3 },
];

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

function BranchesUserForm() {
  const { preloadedUserFormData, setCurrentUrl } = useContext(
    CompleteDataContext
  );
  const [allUsers, setAllUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location.pathname, setCurrentUrl]);

  // Get all users
  useEffect(() => {
    branchesHttpServices
      .getAll('users')
      .then((returnedData) => {
        setAllUsers(returnedData);
      })
      .catch((error) => {
        console.error('Failed to load users:', error);
        openNotificationWithIcon(
          'error',
          'Could not load users',
          'Start the branches server with: npm run branches-server'
        );
      });
  }, []);

  const hasPreloadedData =
    preloadedUserFormData &&
    !Array.isArray(preloadedUserFormData) &&
    Object.keys(preloadedUserFormData).length > 0;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm(
    hasPreloadedData ? { defaultValues: preloadedUserFormData } : undefined
  );

  const onSubmit = async ({ name, phone, email, organisation }) => {
    const newUserData = {
      name,
      email,
      phone,
      organisation,
    };

    const userAlreadyExists =
      hasPreloadedData &&
      allUsers.some((eachUser) => eachUser.id === preloadedUserFormData.id);

    setIsSubmitting(true);

    try {
      /* 
      If form is not prefilled add new data
      Otherwise, replace data
      */
      if (!userAlreadyExists) {
        const returnedUser = await branchesHttpServices.add(
          { ...newUserData, id: uuidv4() },
          'users'
        );
        setAllUsers((prev) => prev.concat(returnedUser));
        openNotificationWithIcon(
          'success',
          'User Added',
          `${returnedUser.name} successfully added`
        );
        if (!hasPreloadedData) {
          reset();
        }
      } else {
        const id = preloadedUserFormData.id;
        const updatedUser = { ...preloadedUserFormData, ...newUserData };
        const returnedUser = await branchesHttpServices.update(
          updatedUser,
          'users',
          id
        );
        setAllUsers((prev) =>
          prev.map((eachUser) =>
            eachUser.id !== returnedUser.id ? eachUser : returnedUser
          )
        );
        openNotificationWithIcon(
          'success',
          'User Updated',
          `${returnedUser.name} successfully updated`
        );
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      openNotificationWithIcon(
        'error',
        'Could not save user',
        'Make sure the branches server is running (npm run branches-server on port 3003).'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className="user-form-content-wrapper">
        <h1 className="center-main-heading">User Form</h1>

        <form
          className="user-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="user-form-inputs-wrapper">
            <div className="user-form-input-container">
              <label
                className="generic-input-label user-form-input-label"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="generic-input"
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                autoFocus
              />
              <p className="input-error-message">
                {errors.name && errors.name.message}
              </p>
            </div>

            <div className="user-form-input-container">
              <label
                className="generic-input-label user-form-input-label"
                htmlFor="email-address"
              >
                Email Address
              </label>
              <input
                className="generic-input"
                type="email"
                id="email-address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                  },
                })}
              />
              <p className="input-error-message">
                {errors.email && errors.email.message}
              </p>
            </div>

            <div className="user-form-input-container h-no-mr">
              <label
                className="generic-input-label user-form-input-label"
                htmlFor="phone-number"
              >
                Phone Number
              </label>
              <input
                className="generic-input"
                type="text"
                inputMode="tel"
                id="phone-number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\d+\-\s()]+$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />
              <p className="input-error-message">
                {errors.phone && errors.phone.message}
              </p>
            </div>

            <div className="user-form-input-container">
              <label
                className="generic-input-label user-form-input-label"
                htmlFor="organisation"
              >
                Organisation
              </label>
              <input
                className="generic-input"
                type="text"
                id="organisation"
                {...register('organisation', {
                  required: 'Organisation is required',
                })}
              />
              <p className="input-error-message">
                {errors.organisation && errors.organisation.message}
              </p>
            </div>

            <div className="user-form-input-container h-not-visible h-hidden-1086-down">
              <label
                className="generic-input-label user-form-input-label"
                htmlFor="branch"
              >
                Branch
              </label>
              <input
                className="generic-input"
                type="text"
                id="branch"
                {...register('branch')}
              />
            </div>

            <div className="user-form-input-container h-no-mr h-not-visible h-hidden-1086-down">
              <label
                className="generic-input-label user-form-input-label"
                htmlFor="date-added"
              >
                Date Added
              </label>
              <Controller
                name="dateAdded"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    format="DD-MM-YYYY"
                    className="generic-input user-form-input"
                    id="date-added"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              <p className="input-error-message">
                {errors.dateAdded && 'Please enter a date'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="generic-submit-button user-form-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : hasPreloadedData ? 'Update' : 'Add'}
          </button>
        </form>
      </div>
    </>
  );
}

export default BranchesUserForm;
