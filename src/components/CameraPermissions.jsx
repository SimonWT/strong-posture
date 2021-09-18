import React from 'react'
import {
    Link
} from "react-router-dom";

const cameraAccess = null


class Home extends React.Component {
    render () {
        return <div>
            <Link to="/askcamera"><button className="main-button big">Get started</button></Link>
        </div>;
    }
}

export default Home