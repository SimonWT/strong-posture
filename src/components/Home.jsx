import React from 'react'
import {
    Link
} from "react-router-dom";
import { Button, Card } from 'ui-neumorphism'
import PostureGif from '../assets/posture.gif'

class Home extends React.Component {
    render () {
        return <div className="home">
            <img src={PostureGif} alt="" />
            <Card className="home-description" elevation={1}>
                <p>Hi!</p>
                <br />
                <p> This app is created for help you with keeping posture correctly. </p>
                <br />
                <p> Timer will help you to focus on your work. Notifications will remind you about posture position. </p>
            </Card>

            <Link to="/permissions" className="no-underline"> <Button className="main-big-button">Get started</Button></Link>
        </div>;
    }
}

export default Home