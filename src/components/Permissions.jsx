import React from "react";
import { Switch, Button } from 'ui-neumorphism'
import { useHistory, Link } from "react-router-dom";

function Permissions () {
    const history = useHistory()
    console.log(Notification.permission)
    const isBrowserSupportNotifications = "Notification" in window
    const [notifcationPermission, setNotifcationPermission] = React.useState(isBrowserSupportNotifications ? Notification.permission : false);

    React.useEffect(() => {
        if (notifcationPermission === 'granted')
            history.push('/action')
    })

    function onChange ({ checked }) {
        if (checked && isBrowserSupportNotifications) {
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
            {!isBrowserSupportNotifications && 
                <Link to="/action" className="no-underline" style={{marginTop: `${30}px`}}>
                    <Button>Ok, next</Button>
                </Link>
            }

        </div>
    )
}

export default Permissions