import React, { useEffect, useContext } from 'react';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import MessageReceiver from '../components/messages/messageReceiver';
import MessageSender from '../components/messages/messageSender';
import SendMessage from '../components/messages/send_message';

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

  return (
    <>
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
    </>
  );
}

export default Messages;
