import React, { useEffect, useContext, useState } from 'react';
import CompleteDataContext from '../Context';
import BreadCrumb from '../components/BreadCrumb';
import MessageReceiver from '../components/messages/messageReceiver';
import MessageSender from '../components/messages/messageSender';
import SendMessage from '../components/messages/send_message';

import { Layout, Menu, Select, Form } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
const { Sider, Content } = Layout;

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Messages', id: 2 },
];

function Messages({ match }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const [collapsed] = useState(false);

  const { Option } = Select;
  const { setValue, control } = useForm();
  const messageSelector = (
    <Select
      className='cost-tracker-select h-4-br'
      id='message-state'
      defaultValue='true'
      suffixIcon={<CaretDownFilled />}
      onChange={(e) => setValue('message', e.target.value, true)}
    >
      <Option className='active-state-option' value='all'>
        All Messages
      </Option>
      <Option className='active-state-option' value='new'>
        New Messages
      </Option>
      <Option className='active-state-option' value='old'>
        Old Messages
      </Option>
    </Select>
  );

  return (
    <div className="messaging-page">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className='message_sidebar'>
          <div className="">
            <div className=''>
              <p>Messages</p>
            </div>
            <Form
              name="basic"
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              autoComplete="off"
              className=''
            >
              <div className='' style={{ width: '100%', marginTop: '15px', marginRight: '10px' }}>
                <Form.Item
                  wrapperCol={{ span: 24 }}
                  name="messageSelector"
                >
                  <Controller
                    as={messageSelector}
                    name='messageSelector'
                    control={control}
                    defaultValue='All Messages'
                    rules={{
                      required: true,
                    }}
                  />
                </Form.Item>
              </div>
            </Form>
            <div className="message-items">
              <div className="message-item1 active">
                <p className="message-item1-name">Alphmaed</p>
                <p className="message-item1-message">Plot 1005 Ademola Adetokumbo Street, Victoria Island, Lagos.</p>
                <div className="message-item1-status-date">
                  <div className="message-item1-status-pending">Pending</div>
                  <div className="message-item1-date">12 : 45pm</div>
                </div>
              </div>
              <div className="message-item1">
                <p className="message-item1-name">Sapio (Meadow Hall)</p>
                <p className="message-item1-message">Plot 1005 Ademola Adetokumbo Street, Victoria Island, Lagos.</p>
                <div className="message-item1-status-date">
                  <div className="message-item1-status-solved">Solved</div>
                  <div className="message-item1-date">Yesterday</div>
                </div>
              </div>
              <div className="message-item1">
                <p className="message-item1-name">Lenoxx Mall</p>
                <p className="message-item1-message">Plot 1005 Ademola Adetokumbo Street, Victoria Island, Lagos.</p>
                <div className="message-item1-status-date">
                  <div className="message-item1-status-solved">Solved</div>
                  <div className="message-item1-date">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                label: 'nav 1',
              },
              {
                key: '2',
                label: 'nav 2',
              },
              {
                key: '3',
                label: 'nav 3',
              },
            ]}
          />

        </Sider>
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              minHeight: 280,
            }}
          >
            <div className="breadcrumb-and-print-buttons">
              <BreadCrumb routesArray={breadCrumbRoutes} />
            </div>
            <div className='message-forms-content-wrapper'>
              <p>Messages</p>
              <div className="message_receiver">
                <MessageReceiver />
              </div>
              <div className="message_sender">
                <MessageSender />
              </div>
              <SendMessage />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default Messages;
