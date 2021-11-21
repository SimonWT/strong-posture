import React, { useEffect, useState } from "react";
import { getStringTimeFromSeconds } from '../utils/helpers'
import { ProgressCircular } from 'ui-neumorphism'


function Stopwatch ({ seconds, active }) {
    const [time, setTime] = useState('00:00')

    useEffect(() => {
        const secondsToShow = seconds
        setTime(getStringTimeFromSeconds(secondsToShow))
    }, [seconds])

    // const getProgressValue = (seconds) => {
    //     return seconds % 60
    // }

    return (
        <div className="action-stopwatch" >
            <ProgressCircular color='#5297ff' size={200} width={8} indeterminate={active}>
                <div className="timer">
                    {time}
                </div>
            </ProgressCircular>
        </div>
    );
}

export default Stopwatch