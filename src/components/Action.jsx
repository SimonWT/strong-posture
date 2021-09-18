import React from "react";
import { Link } from "react-router-dom";

import Timer from './Timer'
import completedTask from '../assets/svg/completedTask.svg'
import { ProgressLinear, Button } from 'ui-neumorphism'

function Action () {
    const totalSeconds = 15 * 60
    const amountOfSecondsPerNotification = 3 * 60

    const [seconds, setSeconds] = React.useState(totalSeconds);
    const [isActive, setIsActive] = React.useState(false);

    React.useEffect(() => {
        if (isActive) {
            if (seconds > 0) {
                if (seconds % amountOfSecondsPerNotification === 0) {
                    notify('Just remind you', 'Keep your posture correctly bruh')
                }
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                notify('You are awesome!!!', 'Nice posture, bro 👊')
            }
        }
    });

    function playAgain () {
        console.log('play again')
        setSeconds(totalSeconds)
    }

    function play() {
        setIsActive(true)
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

    return (
        <div className="action">
            {seconds <= 0 &&
                <div className="congrats-head">
                    <img src={completedTask} alt="Congrats" />
                    <h1>Congrats!</h1>
                </div>
            }
            <div className="action-timer">
                <Timer seconds={seconds} />
                <span className="slash">/</span>
                <span className="total-time">25:00</span>
            </div>
            {isActive &&
                <ProgressLinear className="timer-progress" height={20} value={((totalSeconds - seconds) / totalSeconds) * 100} color={(seconds > 0 ? '#808B9F' : 'var(--success)')}></ProgressLinear>
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