import React from "react"

function Audio ({ sounds }) {
    return (
        <div>
            <audio id="audio" src="/audio/minecraftDamage.mp3" style={{ display: 'None' }} />
            {Object.entries(sounds).map(([key, value]) =>
                // style={{ display: 'None' }}
                <audio id={"audio-" + key} src={"/audio/" + value} key={key}></audio>
            )}
        </div>
    )
}

export default Audio