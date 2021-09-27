import React from 'react'
import { Switch, TextField } from 'ui-neumorphism'
import { getSeconsFromTime, getStringTimeFromSeconds } from '../utils/helpers'

function NotificationsSettings (props) {
    const isBrowserSupportNotifications = ("Notification" in window) ? true : false
    const [notifcationPermission, setNotifcationPermission] = React.useState(isBrowserSupportNotifications ? Notification.permission : false);
    const [soundPermission, setSoundPermission] = React.useState(props.permissions.sound);
    const [videoPermission, setVideoPermission] = React.useState(props.permissions.video);
    const [imagesPermission, setImagesPermission] = React.useState(props.permissions.images);

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
                <Switch onChange={onVideoChange} checked={videoPermission} color='var(--success)' label='Video' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.video)} onInput={($event) => onIntervalInput($event, 'video')} />
                }
            </li>
            <li>
                <Switch onChange={onImagesChange} checked={imagesPermission} color='var(--success)' label='Images' />
                {props.areShowInvervalInputs &&
                    <TextField className="interval-input" type="time" value={getStringTimeFromSeconds(props.timeIntervals.images)} onInput={($event) => onIntervalInput($event, 'images')} />
                }
            </li>
        </ul>
    )
}

export default NotificationsSettings