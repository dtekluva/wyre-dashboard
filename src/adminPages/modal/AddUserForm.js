import React from 'react';
import { Form, Select, Row, Col, DatePicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { CaretDownFilled } from '@ant-design/icons';
function AddUserForm() {
    // modal form 
    const { Option } = Select;
    const { register, handleSubmit, setValue, control, errors } = useForm();
    const branchSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='branch-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('iconType', e.target.value, true)}
        >
            <Option className='active-state-option' value='Lekki'>
                Lekki
            </Option>
            <Option className='active-state-option' value='VI'>
                Victoria Island
            </Option>
        </Select>
    );
    const roleSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='role-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('role', e.target.value, true)}
        >
            <Option className='active-state-option' value='administrator'>
                Administrator
            </Option>
            <Option className='active-state-option' value='manager'>
                Manager
            </Option>
            <Option className='active-state-option' value='viewer'>
                Viewer
            </Option>
        </Select>
    );
    const permissionSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='permission-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('permission', e.target.value, true)}
        >
            <Option className='active-state-option' value='1'>
                1
            </Option>
            <Option className='active-state-option' value='2'>
                2
            </Option>
            <Option className='active-state-option' value='3'>
                3
            </Option>
            <Option className='active-state-option' value='4'>
                4
            </Option>
            <Option className='active-state-option' value='5'>
                5
            </Option>
        </Select>
    );
    const dateAddedPicker = (
        <DatePicker
            format='DD-MM-YYYY'
            className='generic-input'
            id='equipment-purchase-date'
            onChange={(e) => setValue('dateAdded', e.target.value, true)}
        />
    );

    const onSubmit = ({ name, phoneNumber, emailAddress, branch, role, permission, dateAdded }) => {
        console.log(name, phoneNumber, emailAddress, branch, role, permission, dateAdded);
    };
    // modal functions ends

    return <div className='cost-tracker-forms-content-wrapper'>
        <h1 className='center-main-heading'>User Form</h1>

        <section className='cost-tracker-form-section'>
            <Form
                className='cost-tracker-form'
                action='#'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='' >
                    <Row>
                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='userName'
                                >
                                    Name
                                </label>
                                <input
                                    className='generic-input'
                                    type='text'
                                    name='userName'
                                    id='userName'
                                    ref={register}
                                    required
                                    autoFocus
                                />
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='phoneNumber'
                                >
                                    Phone Number
                                </label>
                                <input
                                    className='generic-input'
                                    type='text'
                                    name='phoneNumber'
                                    id='phoneNumber'
                                    ref={register}
                                    required
                                    autoFocus
                                />
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='emailAddress'
                                >
                                    Email Address
                                </label>
                                <input
                                    className='generic-input'
                                    type='email'
                                    name='emailAddress'
                                    id='emailAddress'
                                    ref={register}
                                    required
                                    autoFocus
                                />
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='branch-state'
                                >
                                    Branch
                                </label>

                                <Controller
                                    as={branchSelector}
                                    name='branch'
                                    control={control}
                                    defaultValue=''
                                    rules={{
                                        required: true,
                                    }}
                                    help={errors.branch && 'Please select a value'}
                                />
                                <p className='input-error-message'>
                                    {errors.branch && 'Please select a value'}
                                </p>
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='role-state'
                                >
                                    Roles
                                </label>

                                <Controller
                                    as={roleSelector}
                                    name='role'
                                    control={control}
                                    defaultValue=''
                                    rules={{
                                        required: true,
                                    }}
                                    help={errors.role && 'Please select a value'}
                                />
                                <p className='input-error-message'>
                                    {errors.role && 'Please select a value'}
                                </p>
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='permission-state'
                                >
                                    Permissions
                                </label>

                                <Controller
                                    as={permissionSelector}
                                    name='permission'
                                    control={control}
                                    defaultValue=''
                                    rules={{
                                        required: true,
                                    }}
                                    help={errors.permission && 'Please select a value'}
                                />
                                <p className='input-error-message'>
                                    {errors.permission && 'Please select a value'}
                                </p>
                            </div>
                        </Col>
                        <Col md={8}>
                            <div className='cost-tracker-input-container'>
                                <label
                                    className='generic-input-label cost-tracker-input-label'
                                    htmlFor='equipment-purchase-date'
                                >
                                    Date
                                </label>
                                <Controller
                                    as={dateAddedPicker}
                                    name='dateAdded'
                                    control={control}
                                    defaultValue=''
                                    rules={{
                                        required: true,
                                    }}
                                    validateStatus={
                                        errors.dateAdded && 'Please enter a date' ? 'error' : ''
                                    }
                                    help={errors.dateAdded && 'Please enter a date'}
                                />
                                <p className='input-error-message'>
                                    {errors.dateAdded && 'Please enter a date'}
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <div className='add_user_form_btn_align'>
                        <button className='generic-submit-button cost-tracker-form-submit-button'>
                            Add
                        </button>
                    </div>
                </div>
            </Form>
        </section>
    </div>
}

export default AddUserForm