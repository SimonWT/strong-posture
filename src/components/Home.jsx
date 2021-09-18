import React from 'react'
import {
    Link
} from "react-router-dom";
import { Button } from 'ui-neumorphism'

class Home extends React.Component {
    render () {
        return <div>
            <Link to="/permissions" className="no-underline"> <Button className="main-big-button">Get started</Button></Link>
        </div>;
    }
}

export default Home