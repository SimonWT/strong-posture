import React, { useEffect } from 'react'

import { bindPage } from './index'

function PostureRecognition (props) {

    function play () {
        bindPage()
    }

    return (
        <div>
            <div id="info" style={{ display: 'none' }}>
            </div>
            <div id="loading" style={{ display: 'flex' }}>
                <div className="spinner-text">
                    Loading PoseNet model...
                </div>
                <div className="sk-spinner sk-spinner-pulse"></div>
            </div>
            <button onClick={play}>Play</button>
            <div id='main' style={{ display: 'none' }}>
                <video id="video" playsInline style={{ display: 'none' }}>
                </video>
                <canvas id="output" />
            </div>
        </div>
    )
}

export default PostureRecognition