import React, { useState } from 'react'
import { IconButton, Dialog, Card } from 'ui-neumorphism'
import settings from '../assets/svg/settings.svg'
import question from '../assets/svg/question.svg'
import NotificationsSettings from './NotificationsSettings'


function Header (props) {
    const [isQuestionModalVisible, setQuestionModalVisibility] = useState(false)
    const [isSettingsModalVisible, setSettingsModalVisibility] = useState(false)

    return (
        <div className="header">
            <IconButton rounded text={false} onClick={() => setQuestionModalVisibility(true)}>
                <img src={question} className="btn-icon" alt="" />
            </IconButton>
            <IconButton rounded text={false} onClick={() => setSettingsModalVisibility(true)}>
                <img src={settings} className="btn-icon" alt="" />
            </IconButton>

            <Dialog
                maxWidth={400}
                minHeight={300}
                visible={isQuestionModalVisible}
                onClose={() => setQuestionModalVisibility(false)}
            >
                <Card style={{ padding: '20px' }}>
                    <p>Hi!</p>
                    <br />
                    <p> This app is created for help you with keeping posture correctly. </p>
                    <br />
                    <p>When you need to work:
                        <ol style={{paddingLeft: '20px'}}>
                            <li> Click on the 'START' </li>
                            <li> Define which notifications you want to see </li>
                            <li> Put time of your session and 'START'</li>
                        </ol>
                    </p>
                    <br />
                    <p>⚙ - you can define your custom intervals for notifications</p>
                    <br />
                    <p>If you have some question, ask me in telegram <a href="https://t.me/yaroslav_yudi" target="_blank"> @yaroslav_yudi </a></p>
                </Card>
            </Dialog>
            <Dialog
                visible={isSettingsModalVisible}
                onClose={() => setSettingsModalVisibility(false)}
            >
                <Card style={{ padding: '20px' }}>
                    <NotificationsSettings {...props} areShowInvervalInputs={true} />
                </Card>
            </Dialog>
        </div>
    )
}

export default Header