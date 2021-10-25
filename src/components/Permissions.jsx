import React from "react";
import { Fab, Button } from 'ui-neumorphism'
import { Link, useHistory } from "react-router-dom";
import { isMobile } from './PostureRecognition/util'

function Permissions (props) {
    let history = useHistory();

    function disableVideo () {
        props.setPermissions({ ...props.permissions, video: false })
        const location = {
            pathname: '/action',
            state: { startTimerOnEnter: true }
        }
        history.push(location);
    }

    async function enableVideo () {
        const videoWidth = 600
        const videoHeight = 500
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('You browser does not support video')
        }
        props.setPermissions({ ...props.permissions, video: true })
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
        const location = {
            pathname: '/action',
            state: { startTimerOnEnter: true }
        }
        history.push(location);
    }

    return (
        <div className="permissions flex-center ask-video">
            <img src="/videoAsking.png" alt="" />
            <p className="text1">Strong posture need to access your camera to track your posture. Because all images processing occurs in your device <b> no data is sent to any server</b>.</p>
            <p className="text2">Turn on the camera permisson for full experience</p>

            <div className="flex-center" style={{ marginTop: `${40}px` }}>
                <Button onClick={disableVideo} outlined>Thanks, not now</Button>
                <Fab onClick={enableVideo} style={{ marginLeft: `${40}px` }}>Enable now</Fab>
            </div>
        </div>
    )
}

export default Permissions