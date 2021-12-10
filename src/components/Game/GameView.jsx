import React, { useEffect, forwardRef, useImperativeHandle, useState } from "react";

const GameView = forwardRef(({ isPostureCorrect }, ref) => {

    // const [isPostureCorrect, setIsPostureCorrect] = useState(true)

    useImperativeHandle(ref, () => ({

        // somethingonposuture (payload) {
        //     setIsPostureCorrect(payload)
        // }

    }));

    return (
        <div>
            {isPostureCorrect !== null &&
                <div className="correctness">
                    { isPostureCorrect ? 
                    <span className="true">Cool, correct!</span>
                    :
                    <span className="false">Not correct &#129324;</span>
                    }
                </div>
            }
        </div>
    )
})

export default GameView