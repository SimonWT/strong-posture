import React from "react";
import { Switch, Fab } from 'ui-neumorphism'
import { useHistory, Link } from "react-router-dom";

function Permissions (props) {
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

    function onImagesChange({checked}) {
        props.setPermissions({ ...props.permissions, images: checked })
    }

    return (
        <div className="permissions flex-center">
            <h3 className="flex-center">Which kind of reminders you want to receive? <img src="https://img.icons8.com/color/30/000000/appointment-reminders--v1.png" /></h3>
            <ul style={{ listStyleType: "none", marginTop: '20px' }}>
                <li>
                    <Switch onChange={onNotificationsChange} checked={notifcationPermission === 'granted'} color='var(--success)' label='Notifications' />
                </li>
                <li>
                    <Switch onChange={onSoundChange} checked={soundPermission} color='var(--success)' label='Sound' />
                </li>
                <li>
                    <Switch onChange={onVideoChange} checked={videoPermission} color='var(--success)' label='Video' />
                </li>
                <li>
                    <Switch onChange={onImagesChange} checked={imagesPermission} color='var(--success)' label='Images' />
                </li>
            </ul>
            <div className="flex-center">
                <Link to="/action" className="no-underline">
                    <Fab style={{ marginTop: `${40}px` }}>Ok, next</Fab>
                </Link>
            </div>
        </div>
    )
}

export default Permissions