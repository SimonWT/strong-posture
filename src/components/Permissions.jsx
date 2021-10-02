import React from "react";
import { Fab, Button } from 'ui-neumorphism'
import { Link, useHistory } from "react-router-dom";
import { isMobile } from './PostureRecognition/util'


import NotificationsSettings from "./NotificationsSettings";

function Permissions (props) {
    let history = useHistory();

    function disableVideo(){
        props.setPermissions({...props.permissions, video: false })
        history.push("/action");
    }

    async function enableVideo(){
        const videoWidth = 600
        const videoHeight = 500
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('You browser does not support video')
        }
        props.setPermissions({...props.permissions, video: true })
        const mobile = isMobile()
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              facingMode: 'user',
              width: mobile ? undefined : videoWidth,
              height: mobile ? undefined : videoHeight,
            },
        })
        props.setVideoStream(stream)
        history.push("/action");
    }

    return (
        <div className="permissions flex-center">
            {/* <h3 className="flex-center">Which kind of reminders you want to receive? <img src="https://img.icons8.com/color/30/000000/appointment-reminders--v1.png" /></h3> */}
            {/* <NotificationsSettings {...props} /> */}
            <h3 className="flex-center">Will you use video posture tracking? <img src="https://img.icons8.com/color/30/000000/camcorder-pro.png"/></h3>
            <div className="flex-center" style={{ marginTop: `${40}px` }}>
                <Button onClick={disableVideo} outlined>No</Button>
                <Fab onClick={enableVideo} style={{ marginLeft: `${40}px` }}>Yes</Fab>
            </div>
            {/* <div className="flex-center">
                <Link to="/action" className="no-underline">
                    <Fab style={{ marginTop: `${40}px` }}>Ok, next</Fab>xw
                </Link>
            </div> */}
        </div>
    )
}

export default Permissions