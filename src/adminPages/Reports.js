import React, { useEffect, useContext } from 'react';
import CompleteDataContext from '../Context';
import BreadCrumb from '../components/BreadCrumb';
import { Form, Input, Select, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { CaretDownFilled } from '@ant-design/icons';

const breadCrumbRoutes = [
    { url: '/', name: 'Home', id: 1 },
    { url: '#', name: 'Manage', id: 2 },
    { url: '#', name: 'View Report', id: 3 },
];

function Reports({ match }) {
    const { setCurrentUrl } = useContext(CompleteDataContext);
    useEffect(() => {
        if (match && match.url) {
            setCurrentUrl(match.url);
        }
    }, [match, setCurrentUrl]);

    const { Option } = Select;
    const { handleSubmit, setValue, control, errors } = useForm();
    const branchSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='branch-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('branch', e.target.value, true)}
        >
            <Option className='active-state-option' value='Branch'>
                Branch
            </Option>
            <Option className='active-state-option' value='Lekki'>
                Lekki
            </Option>
            <Option className='active-state-option' value='VI'>
                Victoria Island
            </Option>
        </Select>
    );
    const monthSelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='month-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('month', e.target.value, true)}
        >
            <Option className='active-state-option' value='Month'>
                Month
            </Option>
            <Option className='active-state-option' value='January'>
                January
            </Option>
            <Option className='active-state-option' value='February'>
                February
            </Option>
            <Option className='active-state-option' value='March'>
                March
            </Option>
            <Option className='active-state-option' value='April'>
                April
            </Option>
            <Option className='active-state-option' value='May'>
                May
            </Option>
            <Option className='active-state-option' value='June'>
                June
            </Option>
            <Option className='active-state-option' value='July'>
                July
            </Option>
            <Option className='active-state-option' value='August'>
                August
            </Option>
            <Option className='active-state-option' value='September'>
                September
            </Option>
            <Option className='active-state-option' value='October'>
                October
            </Option>
            <Option className='active-state-option' value='November'>
                November
            </Option>
            <Option className='active-state-option' value='December'>
                December
            </Option>
        </Select>
    );
    const frequencySelector = (
        <Select
            className='cost-tracker-select h-4-br'
            id='frequency-state'
            defaultValue='true'
            suffixIcon={<CaretDownFilled />}
            onChange={(e) => setValue('frequency', e.target.value, true)}
        >
            <Option className='active-state-option' value='Frequency'>
                Frequency
            </Option>
            <Option className='active-state-option' value='Daily'>
                Daily
            </Option>
            <Option className='active-state-option' value='Weekly'>
                Weekly
            </Option>
            <Option className='active-state-option' value='Monthly'>
                Monthly
            </Option>
            <Option className='active-state-option' value='Yearly'>
                Yearly
            </Option>
        </Select>
    );
    const onSubmit = ({ deviceName, deviceIdentity, deviceType, activeState, iconType, load, source }) => {
        console.log(deviceName, deviceIdentity, deviceType, activeState, iconType, load, source);
    };
    return (
        <>
            <div className='breadcrumb-and-print-buttons'>
                <BreadCrumb routesArray={breadCrumbRoutes} />
            </div>

            <article className='table-with-header-container h-no-mt'>
                <div className='reports_page'>
                    <Row>
                        <Col span={20} offset={4} xs={24}>
                            <div className="view_branch_top">
                                <div style={{ display: 'flex' }}>
                                    <h3 className='table-header__heading'>Report</h3>
                                </div>
                                <section className='cost-tracker-form-section'>
                                    <Form
                                        name="basic"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                        className='cost-tracker-form'
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className='add-cclient-form-inputs-wrapper'>
                                            <div className="reports_label">
                                                <label name="setTarget">Set Target</label>
                                            </div>
                                            <div className='add-client-input-container'>
                                                <Form.Item
                                                    wrapperCol={{ span: 24 }}
                                                    name="deviceName"
                                                    rules={[{ required: true, message: 'Please input your device name!' }]}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>
                                            </div>
                                            <div className="reports_label">
                                                <label name="kwh">(KWH)</label>
                                            </div>
                                            <div>
                                                <button className='generic-submit-button cost-tracker-form-submit-button' style={{ margin: '0' }}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                    <Form
                                        name="basic"
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                        className='cost-tracker-form'
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className='add-cclient-form-inputs-wrapper'>
                                            <div className="reports_label">
                                                <label name="setTarget">Set Target</label>
                                            </div>
                                            <div className='add-client-input-container'>
                                                <Form.Item
                                                    wrapperCol={{ span: 24 }}
                                                    name="deviceName"
                                                    rules={[{ required: true, message: 'Please input your device name!' }]}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>
                                            </div>
                                            <div className="reports_label">
                                                <label name="ngn">(NGN)</label>
                                            </div>
                                            {/* <Form.Item
                                        labelCol={{ span: 18 }}
                                        name="NGN"
                                        label="(NGN)"
                                    >
                                    </Form.Item> */}
                                            <div>
                                                <button className='generic-submit-button cost-tracker-form-submit-button' style={{ margin: '0' }}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                    <div style={{ display: 'flex', paddingTop: 30 }}>
                                        <h3 className='table-header__heading'>Generate Report</h3>
                                    </div>
                                    <Form
                                        name="basic"
                                        wrapperCol={{ span: 6 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                        className='cost-tracker-form'
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className='add-cclient-form-inputs-wrapper'>
                                            <div className='reports-input-container'>
                                                <Form.Item
                                                    wrapperCol={{ span: 24 }}
                                                    name="branchSelector"
                                                    rules={[{ required: true, message: 'Please select a branch!' }]}
                                                >
                                                    <Controller
                                                        as={branchSelector}
                                                        name='branchSelector'
                                                        control={control}
                                                        defaultValue='Branch'
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        help={errors.branchSelector && 'Please select a branch'}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className='reports-input-container'>
                                                <Form.Item
                                                    wrapperCol={{ span: 24 }}
                                                    name="monthSelector"
                                                    rules={[{ required: true, message: 'Please select a value!' }]}
                                                >
                                                    <Controller
                                                        as={monthSelector}
                                                        name='monthSelector'
                                                        control={control}
                                                        defaultValue='Month'
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        help={errors.branchSelector && 'Please select a value'}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <button className='generic-submit-button cost-tracker-form-submit-button' style={{ margin: '0' }}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                    <div style={{ display: 'flex', paddingTop: 30 }}>
                                        <h3 className='table-header__heading' style={{ textAlign: 'left' }}>Automated Report Frequency</h3>
                                    </div>
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
                                            <div className='reports-input-container'>
                                                <Form.Item
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 24 }}
                                                    name="frequencySelector"
                                                    rules={[{ required: true, message: 'Please select a value!' }]}
                                                >
                                                    <Controller
                                                        as={frequencySelector}
                                                        name='frequencySelector'
                                                        control={control}
                                                        defaultValue='Frequency'
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        help={errors.frequencySelector && 'Please select a value'}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <button className='generic-submit-button cost-tracker-form-submit-button' style={{ margin: '0' }}>
                                                    Set
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                </section>
                            </div>
                        </Col>
                    </Row>
                </div>
            </article>
        </>
    );
}

export default Reports;