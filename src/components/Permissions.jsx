import React from "react";
import { Switch } from 'ui-neumorphism'
import { useHistory } from "react-router-dom";

function Permissions () {
    const history = useHistory()
    console.log(Notification.permission)
    const [notifcationPermission, setNotifcationPermission] = React.useState(Notification.permission);

    React.useEffect(() => {
        if (notifcationPermission === 'granted')
            history.push('/action')
    })

    function onChange ({ checked }) {
        if (checked) {
            Notification.requestPermission(function (permission) {
                setNotifcationPermission(permission)
                console.log(permission)
                // Если пользователь разрешил, то создаём уведомление
                if (permission === "granted") {
                    new Notification("Notications will look like this!");
                    history.push('/action')
                }
            });
        }
    }

    return (
        <div className="permissions">
            <ul style={{ listStyleType: "none" }}>
                <li>
                    <Switch onChange={onChange} checked={notifcationPermission === 'granted'} color='var(--error)' color='var(--success)' label='Notifications' />
                </li>
            </ul>
        </div>
    )
}

export default Permissions