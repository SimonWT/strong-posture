import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import * as workerTimers from 'worker-timers';

import Timer from './Timer'
import ConsequencesImages from './ConsequencesImages'
import { ProgressLinear, Button, Card, IconButton, TextField } from 'ui-neumorphism'
import GameView from './Game/GameView'
import PostureRecognition from "./PostureRecognition/PostureRecognition";
import AskPermissions from './AskPermissions'

import useAudio from '../utils/useAudio'
import useNotifications from '../utils/useNotifications'

import { getSeconsFromTime } from '../utils/helpers'

import { sendAmplitudeData } from '../utils/amplitude'

import completedTask from '../assets/svg/completedTask.svg'
import playIcon from '../assets/svg/play.svg'
import pauseIcon from '../assets/svg/pause.svg'


const TIMER_PAUSED = 'TIMER_PAUSED'
const TIMER_ACTIVE = 'TIMER_ACTIVE'
const TIMER_NULL = 'TIMER_NULL'
const TIMER_DONE = 'TIMER_DONE'


function Action (props) {
    const [totalSeconds, setTotalSeconds] = useState(15 * 60);
    const [userTimerInput, setUserTimerInput] = useState(getSavedTimer())
    const [seconds, setSeconds] = useState(totalSeconds);
    const [timerId, setTimerId] = useState(null);
    const [timerState, setTimerState] = useState(TIMER_NULL);
    const [isPostureCorrect, setIsPostureCorrect] = useState(true)
    const [recogntitionTicks, setRecogntitionTicks] = useState(0)
    const [isUserTimerInputChaged, setUserTimerInputChaged] = useState(false)

    const badImgsRef = React.createRef();
    const gameRef = useRef();
    const recognitionRef = useRef()

    const [toggleAudio, warmupAudio, playHurtSound] = useAudio(props.setAudioContext)
    const [notify, remindByNotification] = useNotifications(true)

    const location = useLocation()

    function getSavedTimer () {
        const lsValue = localStorage.getItem('user-timer-input') // "15:00"
        return lsValue ?? "15:00"
    }

    useEffect(() => {
        const opposite = totalSeconds - seconds
        if (timerState === TIMER_ACTIVE) {
            if (seconds > 0) {
                if (!props.permissions.video) {
                    if ((opposite % props.timeIntervals.notifications === 0) && seconds !== totalSeconds) {
                        remindByNotification()
                    }
                    if (props.permissions.images && (opposite % props.timeIntervals.images === 0) && seconds !== totalSeconds) {
                        toggleBadImages()
                    }
                    if (props.permissions.sound && (opposite % props.timeIntervals.sound === 0) && seconds !== totalSeconds) {
                        toggleAudio(props.audioContext)
                    }
                }
            } else {
                workerTimers.clearInterval(timerId)
                setTimerState(TIMER_DONE)
                if (props.permissions.video)
                    recognitionRef.current.stop()
                notify('You are awesome!!!', 'Nice posture, bro 👊')
                sendAmplitudeData('session-ended')
            }
        }
    }, [seconds])

    useEffect(() => {
        if (!isPostureCorrect) {
            if (props.permissions.sound)
                playHurtSound(props.audioContext)
            if (props.permissions.notifications) {
                remindByNotification()
            }
        }
    }, [recogntitionTicks])

    useEffect(() => {
        if (location?.state?.startTimerOnEnter) start()
    }, [location])

    function playAgain () {
        setSeconds(totalSeconds);
    }

    function start () {
        const seconds = getSeconsFromTime(userTimerInput)
        setTotalSeconds(seconds)
        setSeconds(seconds);
        play()

        sendAmplitudeData('timer-start')
    }

    function play () {
        const intervalId = workerTimers.setInterval(() => (setSeconds(seconds => seconds - 1)), 1000)
        setTimerId(intervalId)
        setTimerState(TIMER_ACTIVE)

        if (props.permissions.video)
            recognitionRef.current.play()
        if (props.permissions.sound)
            warmupAudio(props.setAudioContext)
    }

    function stop () {
        console.log('stopped')
        setTimerState(TIMER_NULL)
        workerTimers.clearInterval(timerId)
        setSeconds(totalSeconds)

        if (props.permissions.video)
            recognitionRef.current.stop()

        sendAmplitudeData('timer-stop', seconds)
    }

    function pause () {
        console.log('paused')
        setTimerState(TIMER_PAUSED)
        workerTimers.clearInterval(timerId)

        if (props.permissions.video)
            recognitionRef.current.stop()

        sendAmplitudeData('timer-pause', seconds)
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
        sendAmplitudeData('timer-duration-changed', getSeconsFromTime(value))
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
        const seconds = getSeconsFromTime(userTimerInput)
        setTotalSeconds(seconds)
        setSeconds(seconds);

        sendAmplitudeData('timer-duration-changed-on-run', seconds)
    }

    function increaseTicks () {
        setRecogntitionTicks(ticks => ticks + 1)
    }

    function emitIsPostureCorrect (payload) {
        gameRef.current.somethingonposuture(payload)
        setIsPostureCorrect(payload)
        increaseTicks()

        sendAmplitudeData('recognition-result', payload)
    }

    return (
        <div className="action">
            {(props.permissions.video) ?
                (
                    <div>{(timerState === TIMER_ACTIVE) && <GameView ref={gameRef} />}
                        <PostureRecognition tickTimeOut={1000} ref={recognitionRef} hideButtons={true} emitIsPostureCorrect={emitIsPostureCorrect} /></div>
                )
                :
                (props.permissions.images && timerState === TIMER_ACTIVE &&
                    <ConsequencesImages ref={badImgsRef} />)
            }
            {seconds <= 0 &&
                <div className="congrats-head">
                    <img src={completedTask} alt="Congrats" />
                    <h1>Congrats!</h1>
                </div>
            }
            {timerState === TIMER_ACTIVE && seconds > 0 &&
                <h1 className="action-title"> Keep your posture correctly! </h1>
            }

            {timerState === TIMER_NULL ?
                <TextField className="time-input" type="time" value={userTimerInput} onInput={onTimeInput} />
                :
                <Card inset className="action-timer-card">
                    <Timer seconds={seconds} totalSeconds={totalSeconds} >
                        <div className={`time-input-on-run ${isUserTimerInputChaged ? 'is-active': ''}`}>
                            <TextField className="time-input small" outlined type="time" value={userTimerInput} onChange={onTimeInputChange} />
                            {isUserTimerInputChaged && <Button className="ok-btn" onClick={onSubmitTimerInput} rounded outlined size='small'> OK </Button>}
                        </div>
                    </Timer>
                </Card>
            }

            {[TIMER_ACTIVE, TIMER_PAUSED].includes(timerState) &&
                <div>
                    <ProgressLinear className="timer-progress" height={20} value={((totalSeconds - seconds) / totalSeconds) * 100} color={(seconds > 0 ? '#808B9F' : 'var(--success)')} />
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
                timerState !== TIMER_ACTIVE && timerState !== TIMER_PAUSED &&
                <Button onClick={start} className="main-big-button action-start">Start</Button>
            }
            {seconds <= 0 &&
                <div className="congrats-bottom">
                    <Link to="/" className="no-underline"><Button>Home</Button></Link>
                    <Button onClick={playAgain}>Again</Button>
                </div>
            }
            <AskPermissions setAudioContext={props.setAudioContext} permissions={props.permissions} setPermissions={props.setPermissions} />
        </div>
    )
}

export default Action