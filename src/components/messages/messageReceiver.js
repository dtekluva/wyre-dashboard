import React from 'react'
import userIcon from '../../images/user.svg'

function MessageReceiver() {
    return (
        <div className="message_receiver_">
            <div className='user_icon_with_name'>
                <img src={userIcon} alt="user" />
                <p><span>Adelekan Ibrahim</span></p>
                <p>12 : 45pm</p>
            </div>
            <div className="message_receiver_card">
                <p>Good afternoon,<br /><br />
                    What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?<br /><br />
                    With kind regards,<br /><br />
                    Adelekan Ibrahim
                </p>
            </div>
        </div>
    )
}

export default MessageReceiver