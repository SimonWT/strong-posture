import React, { useEffect, forwardRef, useImperativeHandle, useState } from "react";

const GameView = forwardRef((props, ref) => {

    const [isPostureCorrect, setIsPostureCorrect] = useState(true)

    useImperativeHandle(ref, () => ({

        somethingonposuture (payload) {
            setIsPostureCorrect(payload)
        }

    }));

    return (
        <div>
            Is you posture correct? - {  isPostureCorrect ? 'YES' : 'NO' }
        </div>
    )
})

export default GameView