import React, { useEffect, useState } from 'react'
import Notification from 'react-web-notification';

import useNotifications from '../utils/useNotifications'



//Component source: https://github.com/mobilusoss/react-web-notification/tree/develop/example


const Notifications = (props) => {

    const [ignore, setIgnore] = useState(false)
    const [title, setTitle] = useState('')
    const [trigger, setTrigger] = useState(true)
    const [options, setOptions] = useState({})

    const [notify, remindByNotification, requestPermission, getPermission, notifySw] = useNotifications(false)


    //   useEffect(() => {
    //     if(trigger){
    //       handleButtonClick()
    //       document.getElementById('sound').muted = false
    //       document.getElementById('sound').play()
    //     }
    //   }, [trigger])

    const handleButtonClick = () => {
        if (ignore) {
            return;
        }
        setTitle('Test')
        setOptions({
            tag: Date.now(),
            body: 'Test 2',
            //   icon: 'favicon-32x32.png',
            //   lang: 'de',
            //   dir: 'ltr',
            //   sound: 'https://www.lukasseyfarth.com/vendor/ubi-bing.mp3'  // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
        })
    }

    const handleButtonClick2 = () => {
        props.swRegistration.getNotifications({}).then(function (notifications) {
            console.log(notifications);
        });
    }
    return (
        <div>
            <button onClick={handleButtonClick} >Notify</button>
            <button onClick={handleButtonClick2}>Notify SW</button>
            <hr />
            <button onClick={() => notifySw('kok', 'lol')} >Notify Custom SW</button>
            <button onClick={() => notify('kok', 'lol')} >Notify Custom</button>
            <button onClick={requestPermission} >Request Permission</button>
            <Notification
                ignore={ignore}
                timeout={5000}
                title={title}
                options={options}
                swRegistration={props.swRegistration}
            />
            {/* <audio id='sound' preload='auto' muted>
          <source src='https://www.lukasseyfarth.com/vendor/ubi-bing.mp3' type='audio/mpeg' />
          <source src='https://www.lukasseyfarth.com/vendor/sound.ogg' type='audio/ogg' />
          <embed hidden={true} autostart='false' loop={false} src='https://www.lukasseyfarth.com/vendor/ubi-bing.mp3' />
        </audio> */}
        </div>
    )
}
export default Notifications