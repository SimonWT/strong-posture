import React, { useEffect, forwardRef, useImperativeHandle  } from "react";

const GameView = forwardRef((props, ref) => {   

    useImperativeHandle(ref, () => ({

        somethingonposuture(payload){
            console.log('GAME', payload)
        }
    
      }));

    return (
        <div> SOME GAMEFICATION</div>
    )
})

export default GameView