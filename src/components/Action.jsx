import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import Timer from './Timer'
import ConsequencesImages from './ConsequencesImages'
import completedTask from '../assets/svg/completedTask.svg'
import { ProgressLinear, Button, Card, IconButton, TextField } from 'ui-neumorphism'
import useAudio from '../utils/useAudio'
import { getSeconsFromTime } from '../utils/helpers'

const TIMER_PAUSED = 'TIMER_PAUSED'
const TIMER_ACTIVE = 'TIMER_ACTIVE'
const TIMER_NULL = 'TIMER_NULL'
const TIMER_DONE = 'TIMER_DONE'


function Action (props) {
    // const totalSeconds = 15 * 60
    // const amountOfSecondsPerNotification = 3 * 60
    // const amountOfSecondsPerImageToggle = 20
    // const amountOfSecondsPerAudio = 40

    const [totalSeconds, setTotalSeconds] = React.useState(15 * 60);
    const [userTimerInput, setUserTimerInput] = React.useState(getSavedTimer())
    const [seconds, setSeconds] = React.useState(totalSeconds);
    const [timerId, setTimerId] = React.useState(null);
    const [timerState, setTimerState] = React.useState(TIMER_NULL);

    const badImgsRef = React.createRef();

    const [toggleAudio] = useAudio()

    function getSavedTimer () {
        const lsValue = localStorage.getItem('user-timer-input') // "15:00"
        return lsValue ?? "15:00"
    }

    useEffect(() => {
        const opposite = totalSeconds - seconds
        if (timerState === TIMER_ACTIVE) {
            if (seconds > 0) {
                if ((opposite % props.timeIntervals.notifications === 0) && seconds !== totalSeconds) {
                    notify('Just remind you', 'Keep your posture correctly bruh')
                }
                if (props.permissions.images && (opposite % props.timeIntervals.images === 0) && seconds !== totalSeconds) {
                    toggleBadImages()
                }
                if (props.permissions.sound && (opposite % props.timeIntervals.sound === 0) && seconds !== totalSeconds) {
                    toggleAudio()
                }
            } else {
                setTimerState(TIMER_DONE)
                notify('You are awesome!!!', 'Nice posture, bro 👊')
            }
        }
    }, [seconds])

    function playAgain () {
        setSeconds(totalSeconds);
    }

    function start () {
        const seconds = getSeconsFromTime(userTimerInput)
        setTotalSeconds(seconds)
        setSeconds(seconds);
        play()
    }

    function play () {
        const intervalId = setInterval(() => (setSeconds(seconds => seconds - 1)), 1000)
        setTimerId(intervalId)
        setTimerState(TIMER_ACTIVE)
    }

    function stop () {
        console.log('stopped')
        setTimerState(TIMER_NULL)
        clearInterval(timerId)
        setSeconds(totalSeconds)
    }

    function pause () {
        console.log('paused')
        setTimerState(TIMER_PAUSED)
        clearInterval(timerId)
    }

    function resume () {
        play()
    }

    function notify (text, body) {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Проверка разрешения на отправку уведомлений
        else if (Notification.permission === "granted") {
            // Если разрешено, то создаём уведомление
            var notification = new Notification(text, { body });
        }
        // В противном случае, запрашиваем разрешение
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // Если пользователь разрешил, то создаём уведомление
                if (permission === "granted") {
                    var notification = new Notification(text, { body });
                }
            });
        }
    }

    function toggleBadImages () {
        badImgsRef.current.toggle()
    }

    function onTimeInput ($event) {
        let value = $event.target.value
        console.log('original value', value, typeof (value))
        setUserTimerInput(value)
        localStorage.setItem('user-timer-input', value)
    }

    return (
        <div className="action">
            {props.permissions.images && timerState === TIMER_ACTIVE &&
                <ConsequencesImages ref={badImgsRef} />
            }
            {seconds <= 0 &&
                <div className="congrats-head">
                    <img src={completedTask} alt="Congrats" />
                    <h1>Congrats!</h1>
                </div>
            }
            {timerState === TIMER_ACTIVE && seconds > 0 &&
                <h1 className="action-title"> Keep you posture correctly! </h1>
            }

            {timerState === TIMER_NULL ?
                <TextField className="time-input" type="time" value={userTimerInput} onInput={onTimeInput}></TextField>
                :
                <Card inset style={{ padding: 20 + 'px', width: 260 + 'px' }}>
                    <Timer seconds={seconds} totalSeconds={totalSeconds} />
                </Card>
            }


            {[TIMER_ACTIVE, TIMER_PAUSED].includes(timerState) &&
                <div>
                    <ProgressLinear className="timer-progress" height={20} value={((totalSeconds - seconds) / totalSeconds) * 100} color={(seconds > 0 ? '#808B9F' : 'var(--success)')}></ProgressLinear>
                    {seconds > 0 &&
                        <div className="btns-group" >
                            <Button onClick={stop}>Stop</Button>
                            {timerState === TIMER_ACTIVE &&
                                <IconButton className="play-resume" rounded text={false} onClick={pause}>
                                    <img src="https://img.icons8.com/ios-glyphs/25/000000/pause--v1.png" />
                                </IconButton>
                            }
                            {timerState === TIMER_PAUSED &&
                                <IconButton className="play-resume" rounded text={false} onClick={resume}>
                                    <img src="https://img.icons8.com/ios-glyphs/25/000000/play--v1.png" />
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
        </div>
    )
}

export default Action