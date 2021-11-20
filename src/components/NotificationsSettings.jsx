import React, { useEffect, useState } from 'react'
import { Switch, TextField } from 'ui-neumorphism'
import { getSeconsFromTime, getStringTimeFromSeconds } from '../utils/helpers'
import useAudio from '../utils/useAudio'
import { sendAmplitudeData } from '../utils/amplitude'
import { debounce } from "debounce";

const trackAmplitudeIntervalChange = debounce((notificationType, value) => sendAmplitudeData('time-interval-changed', {
    notificationType, interval: value
}), 4000, false)

function NotificationsSettings (props) {
    const isBrowserSupportNotifications = ("Notification" in window) ? true : false
    const [notifcationPermission, setNotifcationPermission] = useState(props.permissions.notifications);
    const [soundPermission, setSoundPermission] = useState(props.permissions.sound);
    const [videoPermission, setVideoPermission] = useState(props.permissions.video);
    const [imagesPermission, setImagesPermission] = useState(props.permissions.images);
    const [switchKey, setSwitchKey] = useState(0)

    const [_, warmupAudio] = useAudio()

    useEffect(() => {
        const { sound, notifications, video } = props.permissions
        setSoundPermission(sound)
        setNotifcationPermission(notifications)
        setVideoPermission(video)
        setSwitchKey(v => v += 1)
    }, [props.permissions])

    function onNotificationsChange ({ checked }) {
        if (checked && isBrowserSupportNotifications) {
            Notification.requestPermission(function (permission) {
                setNotifcationPermission(Notification.permission === 'granted')
                // Если пользователь разрешил, то создаём уведомление
                if (Notification.permission === "granted") {
                    new Notification("Notications will look like this!");
                }
            });
        }
        props.setPermissions({ ...props.permissions, notifications: checked })
    }

    function onSoundChange ({ checked }) {
        setSoundPermission(checked)
        props.setPermissions({ ...props.permissions, sound: checked })
        warmupAudio()
        sendAmplitudeData('sound-notifications-switched-to', checked)
    }

    function onVideoChange ({ checked }) {
        setVideoPermission(checked)
        props.setPermissions({ ...props.permissions, video: checked })
        sendAmplitudeData('video-settings-to', checked)
    }

    function onImagesChange ({ checked }) {
        props.setPermissions({ ...props.permissions, images: checked })
        sendAmplitudeData('image-settings-switched-to', checked)
    }

    function onIntervalInput ($event, notificationType) {
        console.log('onIntervalInput', $event.target.value, notificationType)
        const seconds = getSeconsFromTime($event.target.value)
        props.setTimeIntervals({ ...props.timeIntervals, [notificationType]: seconds })

        trackAmplitudeIntervalChange(notificationType, $event.target.value)
    }

    return (
        <ul className="notifications-settings">
            <p> Notification </p>
            <li>
                <Switch key={switchKey} onChange={onNotificationsChange} checked={notifcationPermission} color='var(--success)' label='Notifications' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.notifications)} onInput={($event) => onIntervalInput($event, 'notifications')} />
                }
            </li>
            <li>
                <Switch key={switchKey} onChange={onSoundChange} checked={soundPermission} color='var(--success)' label='Sound' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.sound)} onInput={($event) => onIntervalInput($event, 'sound')} />
                }
            </li>
            <li>
                <Switch key={switchKey} onChange={onImagesChange} checked={imagesPermission} color='var(--success)' label='Images' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.images)} onInput={($event) => onIntervalInput($event, 'images')} />
                }
            </li>
            <p> Tracking </p>
            <li>
                <Switch key={switchKey} onChange={onVideoChange} checked={videoPermission} color='var(--success)' label='Video' />
                {/* {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.video)} onInput={($event) => onIntervalInput($event, 'video')} />
                } */}
            </li>
        </ul>
    )
}

export default NotificationsSettings