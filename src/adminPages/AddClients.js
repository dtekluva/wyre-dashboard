import React, { useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, DatePicker, Select, Upload } from 'antd';
import CompleteDataContext from '../Context';

import { Input, Form } from 'antd';

import { CaretDownFilled } from '@ant-design/icons';

import BreadCrumb from '../components/BreadCrumb';


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/view-clients', name: 'Manage', id: 2 },
  { url: '/view-clients', name: 'View Clients', id: 3 },
  { url: '#', name: 'Add Clients', id: 4 },
];

const { Option } = Select;

const AddClients = ({ match }) => {
  const { setCurrentUrl } = useContext(CompleteDataContext);

  const { register, handleSubmit, setValue, control, errors } = useForm();

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const dateAddedPicker = (
    <DatePicker
      format='DD-MM-YYYY'
      className='generic-input'
      id='equipment-purchase-date'
      onChange={(e) => setValue('dateAdded', e.target.value, true)}
    />
  );

  const activeStateSelector = (
    <Select
      className='cost-tracker-select h-4-br'
      id='active-state'
      defaultValue='true'
      suffixIcon={<CaretDownFilled />}
      onChange={(e) => setValue('activeState', e.target.value, true)}
    >
      <Option className='active-state-option' value='true'>
        True
      </Option>
      <Option className='active-state-option' value='false'>
        False
      </Option>
    </Select>
  );

  const onSubmit = ({ deviceCode, deviceType, activeState, dateAdded }) => {
    console.log(deviceCode, deviceType, activeState, dateAdded);
  };

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className='cost-tracker-forms-content-wrapper'>
        <h1 className='center-main-heading'>Clients</h1>

        <section className='cost-tracker-form-section'>
          {/* <form
            className='cost-tracker-form'
            action='#'
            onSubmit={handleSubmit(onSubmit)}
          > */}
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className='add-cclient-form-inputs-wrapper'>
              {/* <div className='cost-tracker-input-container'>
                <label
                  className='generic-input-label cost-tracker-input-label'
                >
                  Company Name
                </label>
                <Input placeholder="ABC" size="large" />
              </div> */}

              <div className='add-client-input-container'>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Company Name"
                  name="companyName"
                  rules={[{ required: true, message: 'Please input your company name!' }]}
                >
                  <Input placeholder="ABC" size="large" />
                </Form.Item>
              </div>
              <div className='add-client-input-container'>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder="Phone Number" size="large" />
                </Form.Item>
              </div>
              <div className='add-client-input-container'>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder="Email" size="large" />
                </Form.Item>
              </div>
            </div>
            <div className='add-cclient-form-inputs-wrapper'>
              {/* <div className='cost-tracker-input-container'>
                <label
                  className='generic-input-label cost-tracker-input-label'
                >
                  Office Address
                </label>
                <Input placeholder="ABC" size="large" />
              </div> */}
              <div className='add-client-input-container'>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Office Address"
                  name="officeAddress"
                  rules={[{ required: true, message: 'Please input your company name!' }]}
                >
                  <Input placeholder="Office Address" size="large" />
                </Form.Item>
              </div>
              <div className='add-client-input-container'>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Office Address"
                  name="officeAddress"
                  rules={[{ required: true, message: 'Please input your company name!' }]}
                >
                  <Upload>
                    <Button >Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </div>

            </div>
            <div className='add-client-button-wrapper'>
              <button className='generic-submit-button'>
                Add
              </button>
            </div>

          </Form>
          {/* </form> */}
        </section>
      </div>
    </>
  );
}

export default AddClients;
