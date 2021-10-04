import React from 'react'
import { Switch, TextField } from 'ui-neumorphism'
import { getSeconsFromTime, getStringTimeFromSeconds } from '../utils/helpers'
import useAudio from '../utils/useAudio'

function NotificationsSettings (props) {
    const isBrowserSupportNotifications = ("Notification" in window) ? true : false
    const [notifcationPermission, setNotifcationPermission] = React.useState(props.permissions.notifications);
    const [soundPermission, setSoundPermission] = React.useState(props.permissions.sound);
    const [videoPermission, setVideoPermission] = React.useState(props.permissions.video);
    const [imagesPermission, setImagesPermission] = React.useState(props.permissions.images);

    const [_, warmupAudio] = useAudio()

    function onNotificationsChange ({ checked }) {
        if (checked && isBrowserSupportNotifications) {
            Notification.requestPermission(function (permission) {
                setNotifcationPermission(permission)
                // Если пользователь разрешил, то создаём уведомление
                if (permission === "granted") {
                    new Notification("Notications will look like this!");
                }
            });
        }
        props.setPermissions({ ...props.permissions, notifications: checked })
    }

    function onSoundChange ({ checked }) {
        setSoundPermission(checked)
        props.setPermissions({ ...props.permissions, sound: checked })
        warmupAudio(props.setAudioContext)

        // function unlockAudio() {
        //     const sound = new Audio('https://firebasestorage.googleapis.com/v0/b/strong-posture.appspot.com/o/Minecraft%20Damage%20(Oof)%20-%20Sound%20Effect%20(HD).mp3?alt=media&token=c57ff8e1-ca58-42ed-bf7c-66ef86c64a0b');
        
        //     sound.play();
        //     sound.pause();
        //     sound.currentTime = 0;
        
        //     document.body.removeEventListener('click', unlockAudio)
        //     document.body.removeEventListener('touchstart', unlockAudio)
        // }
        
        // document.body.addEventListener('click', unlockAudio);
        // document.body.addEventListener('touchstart', unlockAudio);
    }

    function onVideoChange ({ checked }) {
        setVideoPermission(checked)
        props.setPermissions({ ...props.permissions, video: checked })
    }

    function onImagesChange ({ checked }) {
        props.setPermissions({ ...props.permissions, images: checked })
    }

    function onIntervalInput ($event, notificationType) {
        console.log('onIntervalInput', $event.target.value, notificationType)
        const seconds = getSeconsFromTime($event.target.value)
        props.setTimeIntervals({ ...props.timeIntervals, [notificationType]: seconds })
    }

    return (
        <ul className="notifications-settings">
            <p> Notification </p>
            <li>
                <Switch onChange={onNotificationsChange} checked={notifcationPermission === 'granted'} color='var(--success)' label='Notifications' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.notifications)} onInput={($event) => onIntervalInput($event, 'notifications')} />
                }
            </li>
            <li>
                <Switch onChange={onSoundChange} checked={soundPermission} color='var(--success)' label='Sound' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.sound)} onInput={($event) => onIntervalInput($event, 'sound')} />
                }
            </li>
            <li>
                <Switch onChange={onImagesChange} checked={imagesPermission} color='var(--success)' label='Images' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.images)} onInput={($event) => onIntervalInput($event, 'images')} />
                }
            </li>
            <p> Tracking </p>
            <li>
                <Switch onChange={onVideoChange} checked={videoPermission} color='var(--success)' label='Video' />
                {/* {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.video)} onInput={($event) => onIntervalInput($event, 'video')} />
                } */}
            </li>
        </ul>
    )
}

export default NotificationsSettings