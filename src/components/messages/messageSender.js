import React from 'react'
import userIcon from '../../images/user.svg'

function MessageSender() {
    return (
        <div className="message_sender_">
            <img src={userIcon} alt="user" />
            <div className="message_sender_card">
                <p>What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?</p>
                <div className="message_date_time">
                    <p>Yesterday</p>
                    <p>12 : 45pm</p>
                </div>
            </div>
        </div>
    )
}

export default MessageSender