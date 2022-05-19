import React from 'react';
import { Form, Select, Checkbox, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { CaretDownFilled } from '@ant-design/icons';



function AddDeviceForm() {
    // modal form 
    const { Option } = Select;
    const { register, handleSubmit, setValue, control, errors } = useForm();
    const deviceTypeSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='iconType-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('iconType', e.target.value, true)}
        >
            <Option className='active-state-option' value='EM133'>
                EM 133
            </Option>
            <Option className='active-state-option' value='EM122'>
                EM 122
            </Option>
            <Option className='active-state-option' value='EM111'>
                EM 111
            </Option>
            <Option className='active-state-option' value='EM141'>
                EM141
            </Option>
            <Option className='active-state-option' value='EM210'>
                EM 210
            </Option>
        </Select>
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
                Active
            </Option>
            <Option className='active-state-option' value='false'>
                Inactive
            </Option>
        </Select>
    );
    const iconTypeSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='iconType-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('iconType', e.target.value, true)}
        >
            <Option className='active-state-option' value='500kWh'>
                500kWh
            </Option>
            <Option className='active-state-option' value='425kWh'>
                425kWh
            </Option>
            <Option className='active-state-option' value='400kWh'>
                400kWh
            </Option>
            <Option className='active-state-option' value='320kWh'>
                320kWh
            </Option>
            <Option className='active-state-option' value='300kWh'>
                300kWh
            </Option>
        </Select>
    );
    const onSubmit = ({ deviceName, deviceIdentity, deviceType, activeState, iconType, load, source }) => {
        console.log(deviceName, deviceIdentity, deviceType, activeState, iconType, load, source);
    };
    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }
    // modal functions ends

    return <div className='cost-tracker-forms-content-wrapper'>
        <h1 className='center-main-heading'>Device Form</h1>

        <section className='cost-tracker-form-section'>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                className='cost-tracker-form'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='add-cclient-form-inputs-wrapper'>
                    <div className='add-client-input-container'>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            label="Device Name"
                            name="deviceName"
                            rules={[{ required: true, message: 'Please input your device name!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </div>
                    <div className='add-client-input-container'>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            label="Device Identity"
                            name="deviceIdentity"
                            rules={[{ required: true, message: 'Please input your device identity!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </div>
                    <div className='add-client-input-container'>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            label="Device Type"
                            name="deviceType"
                            rules={[{ required: true, message: 'Please input your device type!' }]}
                        >
                            <Controller
                                as={deviceTypeSelector}
                                name='deviceType'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: true,
                                }}
                                help={errors.deviceType && 'Please select a value'}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className='add-cclient-form-inputs-wrapper'>
                    <div className='add-client-input-container'>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            label="Active"
                            name="activeState"
                            rules={[{ required: true, message: 'Please select a value!' }]}
                        >
                            <Controller
                                as={activeStateSelector}
                                name='activeState'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: true,
                                }}
                                help={errors.activeState && 'Please select a value'}
                            />
                            {/* <p className='input-error-message'>
                                {errors.activeState && 'Please select a value'}
                            </p> */}
                        </Form.Item>
                    </div>
                    <div className='add-client-input-container'>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            label="Icon Type"
                            name="iconType"
                            rules={[{ required: true, message: 'Please select a value!' }]}
                        >
                            <Controller
                                as={iconTypeSelector}
                                name='iconType'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: true,
                                }}
                                help={errors.iconType && 'Please select a value'}
                            />
                            {/* <p className='input-error-message'>
                                {errors.iconType && 'Please select a value'}
                            </p> */}
                        </Form.Item>
                    </div>
                    <div className='add-client-input-container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', marginTop: '42px' }}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            name="load"
                            rules={[{ required: true, message: 'Please select a value!' }]}
                        >
                            <Checkbox onChange={onChange} name='load'
                                id='load'
                                ref={register}
                                required>Load</Checkbox>
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            name="source"
                            rules={[{ required: true, message: 'Please select a value!' }]}
                        >
                            <Checkbox onChange={onChange} name='source'
                                id='source'
                                ref={register}
                                required>Source</Checkbox>
                        </Form.Item>
                    </div>
                </div>
                <div className='add_user_form_btn_align'>
                    <button className='generic-submit-button cost-tracker-form-submit-button'>
                        Add
                    </button>
                </div>
            </Form>
        </section>
    </div>
}

export default AddDeviceForm