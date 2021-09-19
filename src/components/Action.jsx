import React from "react";
import { Link } from "react-router-dom";

import Timer from './Timer'
import ConsequencesImages from './ConsequencesImages'
import completedTask from '../assets/svg/completedTask.svg'
import { ProgressLinear, Button, Card } from 'ui-neumorphism'
import useAudio from '../utils/useAudio'


function Action (props) {
    const totalSeconds = 15 * 60
    const amountOfSecondsPerNotification = 3 * 60
    const amountOfSecondsPerImageToggle = 20
    const amountOfSecondsPerAudio = 10

    const [seconds, setSeconds] = React.useState(totalSeconds);
    const [isActive, setIsActive] = React.useState(false);

    const badImgsRef = React.createRef();

    const [toggleAudio] = useAudio()

    React.useEffect(() => {
        let timeoutId
        if (isActive) {
            if (seconds > 0) {
                if ((seconds % amountOfSecondsPerNotification === 0) && seconds !== totalSeconds) {
                    notify('Just remind you', 'Keep your posture correctly bruh')
                }
                if ((seconds % amountOfSecondsPerImageToggle === 0) && seconds !== totalSeconds) {
                    toggleBadImages()
                }
                if (props.permissions.sound && (seconds % amountOfSecondsPerAudio === 0) && seconds !== totalSeconds) {
                    console.log('here')
                    toggleAudio()
                }
                timeoutId = setTimeout(() => { if (isActive) setSeconds(seconds - 1) }, 1000);
            } else {
                notify('You are awesome!!!', 'Nice posture, bro 👊')
            }
        } else {
            // console.log('here', timeoutId)
            clearTimeout(timeoutId)
        }
    });

    function playAgain () {
        setSeconds(totalSeconds);
    }

    function play () {
        setIsActive(true);
        setSeconds(totalSeconds);
    }

    function stop () {
        console.log('stopped')
        setIsActive(false)
        setTimeout(() => setSeconds(totalSeconds), 1000);
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

    return (
        <div className="action">
            {props.permissions.images && isActive &&
                <ConsequencesImages ref={badImgsRef} />
            }
            {seconds <= 0 &&
                <div className="congrats-head">
                    <img src={completedTask} alt="Congrats" />
                    <h1>Congrats!</h1>
                </div>
            }
            {isActive && seconds > 0 &&
                <h1 style={{ marginBottom: 60 + 'px' }}> Keep you posture correctly! </h1>
            }
            <Card inset style={{ padding: 20 + 'px', width: 260 + 'px' }}>
                <div className="action-timer">
                    <Timer seconds={seconds} />
                    <span className="slash">/</span>
                    <span className="total-time">{totalSeconds / 60}:00</span>
                </div>
            </Card>
            {isActive &&
                <div>
                    <ProgressLinear className="timer-progress" height={20} value={((totalSeconds - seconds) / totalSeconds) * 100} color={(seconds > 0 ? '#808B9F' : 'var(--success)')}></ProgressLinear>
                    {seconds > 0 &&
                        <div className="btns-group" >
                            <Button onClick={stop}>Stop</Button>
                        </div>
                    }
                </div>
            }
            {
                !isActive &&
                <Button onClick={play} className="main-big-button action-start">Start</Button>
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