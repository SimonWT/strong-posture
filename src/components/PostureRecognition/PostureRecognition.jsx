import React, { useEffect, useState } from 'react'

import { loadVideo } from './index'
import { drawSkeleton, drawKeypoints, drawBoundingBox, isMobile } from './util'
import * as posenet from '@tensorflow-models/posenet'


function PostureRecognition (props) {

    const [isActive, setIsActive] = useState(false)
    const [stream, setStream] = useState(undefined)
    const [requestAnimationFrameIds, setRequestAnimationFrameIds] = useState([])

    function pushRequestId (id) {
        console.log('new', id)
        setRequestAnimationFrameIds([...requestAnimationFrameIds, id])
        console.log(requestAnimationFrameIds)
    }

    const videoWidth = 600
    const videoHeight = 500

    const defaultQuantBytes = 2

    const defaultMobileNetMultiplier = isMobile() ? 0.5 : 0.75
    const defaultMobileNetStride = 16
    const defaultMobileNetInputResolution = 500

    const defaultResNetMultiplier = 1.0
    const defaultResNetStride = 32
    const defaultResNetInputResolution = 250

    const guiState = {
        algorithm: 'single-pose',
        input: {
            architecture: 'MobileNetV1',
            outputStride: defaultMobileNetStride,
            inputResolution: defaultMobileNetInputResolution,
            multiplier: defaultMobileNetMultiplier,
            quantBytes: defaultQuantBytes,
        },
        singlePoseDetection: {
            minPoseConfidence: 0.1,
            minPartConfidence: 0.5,
        },
        multiPoseDetection: {
            maxPoseDetections: 5,
            minPoseConfidence: 0.15,
            minPartConfidence: 0.1,
            nmsRadius: 30.0,
        },
        output: {
            showVideo: true,
            showSkeleton: true,
            showPoints: true,
            showBoundingBox: false,
        },
        net: null,
    }


    function play () {
        setIsActive(true)
        bindPage()
    }

    function stop () {
        console.log('stop')
        setIsActive(false)
        for (const requestId of requestAnimationFrameIds) {
            cancelAnimationFrame(requestId)
        }
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    function detectPoseInRealTime (video, net) {
        const canvas = document.getElementById('output')
        const ctx = canvas.getContext('2d')

        // since images are being fed from a webcam, we want to feed in the
        // original image and then just flip the keypoints' x coordinates. If instead
        // we flip the image, then correcting left-right keypoint pairs requires a
        // permutation on all the keypoints.
        const flipPoseHorizontal = true

        canvas.width = videoWidth
        canvas.height = videoHeight

        let xuyna

        const poseDetectionFrame = async () => {

            // Begin monitoring code for frames per second

            let poses = []
            let minPoseConfidence
            let minPartConfidence
            switch (guiState.algorithm) {
                case 'single-pose':
                    const pose = await net.estimatePoses(video, {
                        flipHorizontal: flipPoseHorizontal,
                        decodingMethod: 'single-person',
                    })
                    poses = poses.concat(pose)
                    minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence
                    minPartConfidence = +guiState.singlePoseDetection.minPartConfidence
                    break
                case 'multi-pose':
                    let all_poses = await net.estimatePoses(video, {
                        flipHorizontal: flipPoseHorizontal,
                        decodingMethod: 'multi-person',
                        maxDetections: guiState.multiPoseDetection.maxPoseDetections,
                        scoreThreshold: guiState.multiPoseDetection.minPartConfidence,
                        nmsRadius: guiState.multiPoseDetection.nmsRadius,
                    })

                    poses = poses.concat(all_poses)
                    minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence
                    minPartConfidence = +guiState.multiPoseDetection.minPartConfidence
                    break
            }

            ctx.clearRect(0, 0, videoWidth, videoHeight)

            if (guiState.output.showVideo) {
                ctx.save()
                ctx.scale(-1, 1)
                ctx.translate(-videoWidth, 0)
                ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
                ctx.restore()
            }

            // For each pose (i.e. person) detected in an image, loop through the poses
            // and draw the resulting skeleton and keypoints if over certain confidence
            // scores
            poses.forEach(({ score, keypoints }) => {
                // console.log('shoulders', keypoints[0].position, keypoints[1].position)
                if (score >= minPoseConfidence) {
                    if (guiState.output.showPoints) {
                        drawKeypoints(keypoints, minPartConfidence, ctx)
                        // console.log('all keypoints', keypoints)
                    }
                    if (guiState.output.showSkeleton) {
                        drawSkeleton(keypoints, minPartConfidence, ctx)
                    }
                    if (guiState.output.showBoundingBox) {
                        drawBoundingBox(keypoints, ctx)
                    }

                    const leftEye = keypoints.find((el) => el.part === 'leftEye').position
                    const rightEye = keypoints.find((el) => el.part === 'rightEye').position
                    const leftShoulder = keypoints.find(
                        (el) => el.part === 'leftShoulder'
                    ).position
                    const rightShoulder = keypoints.find(
                        (el) => el.part === 'rightShoulder'
                    ).position

                    const xEyes = rightEye.x - leftEye.x
                    const xShoulders = rightShoulder.x - leftShoulder.x

                    let alpha = 0.2


                    if (!xuyna) {
                        xuyna = 100000
                        console.log('я дэбил')
                    }

                    if (xShoulders < xuyna) {
                        xuyna = xShoulders
                    }

                    // else {
                    if (xuyna * (1 + alpha) < xShoulders) {
                        console.log('тварь выпрямись', xuyna, xShoulders)
                    } else {
                        console.log('хороший мальчик', xuyna, xShoulders)
                    }
                    // }

                    // const ratio = xEyes / xShoulders

                    // console.log(ratio, xEyes, xShoulders)
                }
            })

            console.log('isActive deep', isActive, video.srcObject)
            
            if (video.srcObject.active)
                setTimeout(() => {
                    const requestId = requestAnimationFrame(poseDetectionFrame)
                    pushRequestId(requestId)
                }, 1000)


            // requestAnimationFrame(poseDetectionFrame)
        }

        poseDetectionFrame()
    }

    async function bindPage () {
        // toggleLoadingUI(true)
        const net = await posenet.load({
            architecture: guiState.input.architecture,
            outputStride: guiState.input.outputStride,
            inputResolution: guiState.input.inputResolution,
            multiplier: guiState.input.multiplier,
            quantBytes: guiState.input.quantBytes,
        })
        // toggleLoadingUI(false)

        let video
        let videoObj

        try {
            videoObj = await loadVideo()
            video = videoObj.video
            setStream(videoObj.stream)
        } catch (e) {
            let info = document.getElementById('info')
            info.textContent =
                'this browser does not support video capture,' +
                'or this device does not have a camera'
            info.style.display = 'block'
            throw e
        }

        // setupGui([], net)
        // setupFPS()
        console.log('isActive', isActive)
        detectPoseInRealTime(video, net)
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
            <button onClick={stop}>Stop</button>
            {isActive &&
                <div id='main' style={{ display: 'none' }}>
                    <video id="video" playsInline style={{ display: 'none' }}>
                    </video>
                    <canvas id="output" />
                </div>
            }
        </div>
    )
}

export default PostureRecognition