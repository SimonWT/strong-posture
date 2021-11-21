import React, { useEffect, useState } from "react";
import { getStringTimeFromSeconds } from '../utils/helpers'


function Timer (props) {
    const [totalTime, setTotalTime] = useState('00:00')
    const [time, setTime] = useState('00:00')

    useEffect(() => {
        const secondsToShow = !props.settings.useStopwatchInsteadOfTimer ? props.seconds : (props.totalSeconds - props.seconds)
        setTime(getStringTimeFromSeconds(secondsToShow))
    }, [props.seconds])

    useEffect(() => {
        setTotalTime(getStringTimeFromSeconds(props.totalSeconds))
    }, [props.totalSeconds])

    return (
        <div className="action-timer">
            <div className="timer">
                {time}
            </div>
            <span className="slash">/</span>
            {props.children ?? <span className="total-time">{totalTime}</span>}
        </div>
    );
}

export default Timer