import React from "react";
import { Fab } from 'ui-neumorphism'
import { Link } from "react-router-dom";

import NotificationsSettings from "./NotificationsSettings";

function Permissions (props) {
    return (
        <div className="permissions flex-center">
            <h3 className="flex-center">Which kind of reminders you want to receive? <img src="https://img.icons8.com/color/30/000000/appointment-reminders--v1.png" /></h3>
            <NotificationsSettings {...props} />
            <div className="flex-center">
                <Link to="/action" className="no-underline">
                    <Fab style={{ marginTop: `${40}px` }}>Ok, next</Fab>
                </Link>
            </div>
        </div>
    )
}

export default Permissions