import React from "react";

function Timer (props) {
    return (
        <div className="timer">
            {Math.floor(props.seconds / 60)}:{props.seconds % 60}
        </div>
    );
}

export default Timer