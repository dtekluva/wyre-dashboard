import React from 'react'
import attach from '../../images/paperclip.svg'
import { Form, Upload, message } from 'antd';
import { useForm } from 'react-hook-form';
import TextArea from 'antd/lib/input/TextArea';

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },

    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }

        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

function SendMessage() {
    const { handleSubmit } = useForm();
    return (
        <div className="send_message">
            <Upload {...props}>
                <img src={attach} alt="attachment" />
            </Upload>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                onSubmit={handleSubmit()}
            >
                <div className='' style={{ display: 'flex', width: '100%' }}>
                    <Form.Item
                        name="message"
                        rules={[{ required: true, message: 'Please input your message!' }]}
                    >
                        <TextArea size="large" placeholder='Message' />
                    </Form.Item>
                    <button className='generic-submit-button cost-tracker-form-submit-button' style={{ margin: '0', width: '89px' }}>
                        Send
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default SendMessage