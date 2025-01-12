import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import * as workerTimers from 'worker-timers';

import Timer from './Timer'
import Stopwatch from './Stopwatch'
import ConsequencesImages from './ConsequencesImages'
import { ProgressLinear, Button, Card, IconButton, TextField } from 'ui-neumorphism'
import GameView from './Game/GameView'
import PostureRecognition from "./PostureRecognition/PostureRecognition";
import AskPermissions from './AskPermissions'
import Audio from './Audio'

import useAudio from '../utils/useAudio'
import useNotifications from '../utils/useNotifications'

import { getSecondsFromTime } from '../utils/helpers'
import { train, classify } from './PostureRecognition/classification'
import { getStorage } from '../utils/userStorage'

import { sendAmplitudeData } from '../utils/amplitude'

import completedTask from '../assets/svg/completedTask.svg'
import playIcon from '../assets/svg/play.svg'
import pauseIcon from '../assets/svg/pause.svg'
import diamondIcon from '../assets/svg/diamondYellowRedStroke.svg'

const TIMER_PAUSED = 'TIMER_PAUSED'
const TIMER_ACTIVE = 'TIMER_ACTIVE'
const TIMER_NULL = 'TIMER_NULL'
const TIMER_DONE = 'TIMER_DONE'

const POSTURE_TRESHOLD = 0.7 // For analytical approach

function Action (props) {
    let history = useHistory();

    const initTotalTime = !props.settings.useStopwatchInsteadOfTimer ? 15 * 60 : 0

    const [totalSeconds, setTotalSeconds] = useState(initTotalTime);
    const [userTimerInput, setUserTimerInput] = useState(getSavedTimer())
    const [seconds, setSeconds] = useState(totalSeconds);
    const [timerId, setTimerId] = useState(null);
    const [timerState, setTimerState] = useState(TIMER_NULL);
    const [isPostureCorrect, setIsPostureCorrect] = useState(null)
    const [recogntitionTicks, setRecogntitionTicks] = useState(0)
    const [isUserTimerInputChaged, setUserTimerInputChaged] = useState(false)
    const [slidingWindow, setSlidingWindow] = useState([])
    const [poseKeypoints, setPostKeypoints] = useState([])

    const badImgsRef = React.createRef();
    const gameRef = useRef();
    const recognitionRef = useRef()

    const [playSound, warmupAudio, playHurtSound, sounds] = useAudio()
    const [notify, remindByNotification] = useNotifications(true)

    const location = useLocation()
    const userId = getStorage().userId

    function getSavedTimer () {
        const lsValue = localStorage.getItem('user-timer-input') // "15:00"
        return (lsValue ?? "15:00")
    }

    function finishSession () {
        workerTimers.clearInterval(timerId)
        setTimerState(TIMER_DONE)
        if (props.permissions.video)
            recognitionRef.current.stop()
        props.increaseExp(totalSeconds) // Gain game EXP
        notify('You are awesome!!!', 'Nice posture, bro 👊')
        sendAmplitudeData('session-ended')
        playSound('levelCompletion')
    }

    function getPostureCorrectnessFromWindow () {
        const reducer = (previousValue, currentValue) => previousValue + currentValue
        const sum = slidingWindow.reduce(reducer)
        const ratio = sum / slidingWindow.length
        if (ratio >= POSTURE_TRESHOLD) return true
        return false
    }

    useEffect(() => {
        const opposite = totalSeconds - seconds
        if (timerState === TIMER_ACTIVE) {
            if (seconds > 0 || props.settings.useStopwatchInsteadOfTimer) {
                if (!props.permissions.video) {
                    if ((opposite % props.timeIntervals.notifications === 0) && seconds !== totalSeconds) {
                        remindByNotification()
                        // TODO: review in terms of UX
                        // playSound('positiveNotification')
                        playSound()
                    }
                    if (props.permissions.images && (opposite % props.timeIntervals.images === 0) && seconds !== totalSeconds) {
                        toggleBadImages()
                    }
                    if (props.permissions.sound && (opposite % props.timeIntervals.sound === 0) && seconds !== totalSeconds) {
                        playSound()
                    }
                } else {
                    if ((opposite % props.timeIntervals.notifications === 0) && seconds !== totalSeconds) {
                        const isPostureCorrect = getPostureCorrectnessFromWindow()
                        if (!isPostureCorrect) {
                            remindByNotification()
                            // TODO: review in terms of UX
                            playSound()
                        }
                    }
                    if (props.permissions.sound && (opposite % props.timeIntervals.sound === 0) && seconds !== totalSeconds) {
                        const isPostureCorrect = getPostureCorrectnessFromWindow()
                        if (!isPostureCorrect) {
                            playSound()
                        }
                    }
                }
            } else {
                finishSession()
            }
        }
    }, [seconds])

    // useEffect(() => {
    //     if (!isPostureCorrect) {
    //         if (props.permissions.sound)
    //             playHurtSound()
    //         if (props.permissions.notifications) {
    //             remindByNotification()
    //         }
    //     }
    // }, [recogntitionTicks])

    useEffect(() => {
        if (props.startTimerOnEnter) {
            start()
            props.setStartTimerOnEnter(false)
        }
    }, [props.startTimerOnEnter])

    function playAgain () {
        setSeconds(totalSeconds);
        start()
        sendAmplitudeData('timer-start-again')
    }

    function start () {
        const seconds = !props.settings.useStopwatchInsteadOfTimer ? getSecondsFromTime(userTimerInput) : initTotalTime
        setTotalSeconds(seconds)
        setSeconds(seconds);
        play()

        sendAmplitudeData('timer-start')
    }

    function play () {
        const secondsManipulation = !props.settings.useStopwatchInsteadOfTimer ? ((seconds) => seconds - 1) : ((seconds) => seconds + 1)
        let intervalId = workerTimers.setInterval(() => (setSeconds(secondsManipulation)), 1000)
        setTimerId(intervalId)
        setTimerState(TIMER_ACTIVE)

        if (props.permissions.video)
            recognitionRef.current.play()
        if (props.permissions.sound)
            warmupAudio()
    }

    function stop () {
        console.log('stopped')
        setTimerState(TIMER_NULL)
        workerTimers.clearInterval(timerId)

        if (props.settings.useStopwatchInsteadOfTimer) {
            finishSession()
        } else {
            setSeconds(totalSeconds)
        }

        if (props.permissions.video)
            recognitionRef.current.stop()

        sendAmplitudeData('timer-stop', { seconds })
    }

    function pause () {
        console.log('paused')
        setTimerState(TIMER_PAUSED)
        workerTimers.clearInterval(timerId)

        if (props.permissions.video)
            recognitionRef.current.stop()

        sendAmplitudeData('timer-pause', { seconds })
    }

    function resume () {
        play()
        sendAmplitudeData('timer-resume')
    }


    function toggleBadImages () {
        badImgsRef.current.toggle()
    }

    function onTimeInput ($event) {
        let value = $event.target.value
        console.log('original value', value, typeof (value))
        setUserTimerInput(value)
        localStorage.setItem('user-timer-input', value)
        sendAmplitudeData('timer-duration-changed', { seconds: getSecondsFromTime(value) })
    }

    function onTimeInputChange ($event) {
        console.log($event)
        setUserTimerInputChaged(true)
        let value = $event.value
        console.log('original value', value, typeof (value))
        setUserTimerInput(value)
        localStorage.setItem('user-timer-input', value)
    }

    function onSubmitTimerInput () {
        setUserTimerInputChaged(false)
        const seconds = getSecondsFromTime(userTimerInput)
        setTotalSeconds(seconds)
        setSeconds(seconds);

        sendAmplitudeData('timer-duration-changed-on-run', { seconds })
    }

    // function increaseTicks () {
    //     setRecogntitionTicks(ticks => ticks + 1)
    // }

    function emitIsPostureCorrect (isPostureCorrect, keypoints) {
        setPostKeypoints(keypoints)
        if (props.settings.useAnalyticalRecognition) {
            // gameRef.current.somethingonposuture(isPostureCorrect)
            setIsPostureCorrect(isPostureCorrect)
            // increaseTicks()
            setSlidingWindow([...slidingWindow, isPostureCorrect ? 1 : 0])
            sendAmplitudeData('recognition-result', { isCorrect: isPostureCorrect })
        }

    }

    // useEffect(() => {
    //     let timeout;
    //     if (poseKeypoints.length > 0) {
    //         if ((totalSeconds - seconds) <= 3) {
    //             train(poseKeypoints, true, userId)
    //         }
    //     }
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, [poseKeypoints])

    if (!props.settings.useAnalyticalRecognition) {
        let recognitionTimer
        useEffect(() => {
            if (timerState === TIMER_ACTIVE) {
                if (!recognitionTimer)
                    recognitionTimer = workerTimers.setInterval(() => {
                        setRecogntitionTicks(ticks => ticks + 1)
                    }, 1000)
            } else {
                if (recognitionTimer) {
                    workerTimers.clearInterval(recognitionTimer)
                }
            }
            return () => {
                workerTimers.clearInterval(recognitionTimer)
            }
        }, [timerState])

        useEffect(async () => {
            if (!poseKeypoints || poseKeypoints.length === 0) return
            if ((totalSeconds - seconds) <= 5) {
                train(poseKeypoints, true, userId)
            } else {
                const isPostureCorrect = await classify(poseKeypoints, userId)
                setIsPostureCorrect(isPostureCorrect)
                sendAmplitudeData('recognition-result', { isCorrect: isPostureCorrect })
                // gameRef.current.somethingonposuture(isPostureCorrect)
                setSlidingWindow([...slidingWindow, isPostureCorrect ? 1 : 0])
            }
        }, [recogntitionTicks])
    }

    return (
        <div className="action">
            {(props.permissions.video) ?
                (
                    <div>{(timerState === TIMER_ACTIVE) && <GameView isPostureCorrect={isPostureCorrect} ref={gameRef} />}
                        <PostureRecognition tickTimeOut={1} ref={recognitionRef} hideButtons={true} emitIsPostureCorrect={emitIsPostureCorrect} seconds={seconds} totalSeconds={totalSeconds} showVideo canvasWidth="300px" /></div>
                )
                :
                (props.permissions.images && timerState === TIMER_ACTIVE &&
                    <ConsequencesImages ref={badImgsRef} />)
            }
            {timerState === TIMER_DONE &&
                <div className="congrats-head">
                    <img src={completedTask} alt="Congrats" />
                    <h1>Congrats!</h1>
                    <div className="gain-exp">
                        <span>+{totalSeconds} </span>
                        <img src={diamondIcon} alt="exp" />
                    </div>
                </div>
            }
            {timerState === TIMER_ACTIVE && (seconds > 0 || props.settings.useStopwatchInsteadOfTimer) &&
                <h1 className="action-title"> Keep your posture correctly! </h1>
            }
            {timerState !== TIMER_DONE &&
                <>
                    {
                        !props.settings.useStopwatchInsteadOfTimer ?
                            <>
                                {timerState === TIMER_NULL ?
                                    <TextField className="time-input" type="time" value={userTimerInput} onInput={onTimeInput} />
                                    :
                                    <Card inset className="action-timer-card">
                                        <Timer seconds={seconds} totalSeconds={totalSeconds} settings={props.settings}>
                                            <div className={`time-input-on-run ${isUserTimerInputChaged ? 'is-active' : ''}`}>
                                                <TextField className="time-input small" outlined type="time" value={userTimerInput} onChange={onTimeInputChange} />
                                                {isUserTimerInputChaged && <Button className="ok-btn" onClick={onSubmitTimerInput} rounded outlined size='small'> OK </Button>}
                                            </div>
                                        </Timer>
                                    </Card>
                                }
                            </>
                            :
                            <>
                                {[TIMER_ACTIVE, TIMER_PAUSED].includes(timerState) ?
                                    <Stopwatch seconds={seconds} active={timerState === TIMER_ACTIVE} />
                                    :
                                    <>
                                        <p style={{ fontSize: '20px' }}> You kept posture correct for</p>
                                        <span><h2 className="timer">{seconds}</h2>seconds</span>
                                    </>
                                }
                            </>
                    }
                </>
            }
            {[TIMER_ACTIVE, TIMER_PAUSED].includes(timerState) &&
                <div>
                    {!props.settings.useStopwatchInsteadOfTimer &&
                        <ProgressLinear className="timer-progress" height={20} value={((totalSeconds - seconds) / totalSeconds) * 100} color={(seconds > 0 ? '#808B9F' : 'var(--success)')} />
                    }
                    {seconds > 0 &&
                        <div className="btns-group" >
                            <Button onClick={stop}>Stop</Button>
                            {timerState === TIMER_ACTIVE &&
                                <IconButton className="play-resume" rounded text={false} onClick={pause}>
                                    <img src={pauseIcon} />
                                </IconButton>
                            }
                            {timerState === TIMER_PAUSED &&
                                <IconButton className="play-resume" rounded text={false} onClick={resume}>
                                    <img src={playIcon} />
                                </IconButton>
                            }
                        </div>
                    }
                </div>
            }
            {
                timerState !== TIMER_ACTIVE && timerState !== TIMER_PAUSED && seconds > 0 &&
                <Button onClick={start} className="main-big-button action-start">Start</Button>
            }
            {seconds <= 0 &&
                <>
                    <Button onClick={playAgain} className="main-big-button action-start">Start a new session</Button>
                    <div className="congrats-bottom">
                        <Link to="/" className="no-underline"><Button>Home</Button></Link>
                        {/* <Button onClick={playAgain}>Again</Button> */}
                    </div>
                </>
            }
            <AskPermissions permissions={props.permissions} setPermissions={props.setPermissions} />
            <Audio sounds={sounds} />
        </div>
    )
}

export default Action