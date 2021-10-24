import React from 'react'
import {
    Link
} from "react-router-dom";
import { Button, Card } from 'ui-neumorphism'
import PostureGif from '../assets/posture.gif'

class Home extends React.Component {
    render () {
        return <div className="home">
            <h1>Strong Posture</h1>
            <img src={PostureGif} alt="" />
            <div className="home-description">
                <p> strong posture help you keep track of your posture while working on your computer. </p>
            </div>
            <Link to="/permissions" className="no-underline"> <Button className="main-big-button">Get started</Button></Link>
        </div>;
    }
}

export default Home