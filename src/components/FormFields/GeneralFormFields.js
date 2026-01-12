import * as React from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Input, Select } from "antd";
import { validate2DecNo } from '../../helpers/genericHelpers';
import { Option } from 'antd/lib/mentions';


const { RangePicker } = DatePicker;

/**
 * @description field for the account number
 * @param {*} inputSize the input size
 * @param {*} data the data to be used to load/display the input
 * @param {*} required either required or not
 * @returns html contente needed
 */
export const NumberField = ({ data, inputSize = 'large', required = true, disabled = false }) => (
    <Form.Item
        label={data.label}
        name={data.name}
        labelCol={{ span: 24 }}
        hasFeedback
        validateTrigger={['onChange', 'onBlur']}
        rules={[
            ({ getFieldValue }) => ({
                validator(rule, value) {
                    if (value && required && Number(getFieldValue(data.name)) <= 0) {
                        return Promise.reject(`${data.label} must be greater than zero`);
                    }
                    return validate2DecNo(value, data.label);
                },
            }),
            ...(required ? [{ required: true, message: `Please input the ${data.label}` }] : []),
        ]}
    >
        <Input
            placeholder={data.placeholder}
            size={inputSize}
            disabled={disabled}
            onChange={(e) => {
                data.onDataChange && data.onDataChange();
            }}
        // onChange={onDataChange}
        />
    </Form.Item>
);

/**
 * @description field for the account number
 * @param {*} inputSize the input size
 * @param {*} data the data to be used to load/display the input
 * @param {*} required either required or not
 * @returns html contente needed
 */
export const DateField = ({ data, inputSize = 'large', required = true }) => (
    <Form.Item
        label={data.label}
        name={data.name}
        labelCol={{ span: 24 }}
        hasFeedback
        validateTrigger={['onChange', 'onBlur']}
        rules={[
            ...(required ? [{ required: true, message: 'Please select date' }] : []),
        ]}
    >
        <DatePicker
            placeholder={data.placeholder}
            size={inputSize}
            style={{
                height: "auto",
                width: "100%",
            }}
        />
    </Form.Item>
);
/**
 * @description field for the account number
 * @param {*} inputSize the input size
 * @param {*} data the data to be used to load/display the input
 * @param {*} required either required or not
 * @returns html contente needed
 */
export const DateRangeField = ({ data, inputSize = 'large', required = true }) => (
    <Form.Item
        label={data.label}
        name={data.name}
        labelCol={{ span: 24 }}
        hasFeedback
        validateTrigger={['onChange', 'onBlur']}
        rules={[
            ...(required ? [{ required: true, message: 'Please select date' }] : []),
        ]}
    >
        <RangePicker
            placeholder={data.placeholder}
            size={inputSize}
            style={{
                height: "auto",
                width: "100%",
            }}
            presets={[
                {
                    label: 'Today',
                    value: [moment(), moment()],
                },
                {
                    label: 'Yesterday',
                    value: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                },
                {
                    label: 'Past Week',
                    value: [moment().subtract(7, 'days'), moment()],
                },
                {
                    label: 'Past Month',
                    value: [moment().subtract(1, 'months'), moment()],
                },
                {
                    label: 'Past Year',
                    value: [moment().subtract(1, 'years'), moment()],
                },
            ]}
        />
    </Form.Item>
);

/**
 * @description field for the account number
 * @param {*} inputSize the input size
 * @param {*} data the data to be used to load/display the input
 * @param {*} required either required or not
 * @returns html contente needed
 */
export const SelectField = ({ data, inputSize = 'large', required = true }) => (
    <Form.Item
        label={data.label}
        name={data.name}
        labelCol={{ span: 24 }}
        hasFeedback
        validateTrigger={['onChange', 'onBlur']}
        rules={[
            ...(required ? [{ required: true, message: 'Please select date' }] : []),
        ]}
    >
        <Select
            size={inputSize}
        >
            {
                data.optionData.map((option) =>
                    <Select.Option key={option} value={option}>
                        {option}
                    </Select.Option>
                )
            }
        </Select>

    </Form.Item>
);

export const SubmitButton = (buttonText = "Submit", inputSize,
    isLoading = false) => (
    <Form.Item
    >
        <Button
            htmlType="submit"
            size={inputSize}
            loading={isLoading || false}
        >
            {buttonText}
        </Button>
    </Form.Item>
);