import React, { useEffect, useState } from 'react'
import { Dialog, Switch } from 'ui-neumorphism'

import useNotifications from '../utils/useNotifications'
import useAudio from '../utils/useAudio'

function AskPermissions (props) {
    const [isModalVisible, setModalVisibility] = useState(false)

    const [pushEnabled, setPushEnabled] = useState(false)
    const [switchKey, setSwitchKey] = useState(0)

    const [notify, remindByNotification, requestPermission, getPermission, notifySw] = useNotifications(true)
    const [toggleAudio, warmupAudio, playHurtSound] = useAudio(props.setAudioContext)

    useEffect(() => {
        if (getPermission() !== 'granted') {
            setModalVisibility(true)
        }
    }, [])

    const onPushNotificationsChange = async () => {
        warmupAudio(props.setAudioContext)
        setPushEnabled(false)
        setSwitchKey((value) => value += 1)
        const requestedPermission = await requestPermission()
        const permission = requestedPermission ?? getPermission()
        setPushEnabled(permission === 'granted')
        setSwitchKey((value) => value += 1)
        if (permission === 'granted') {
            props.setPermissions({ ...props.permissions, notifications: true, sound: true })
            setModalVisibility(false)
        }
    }

    return (
        <Dialog visible={isModalVisible} className="ask-permission-dialog">
            <div>
                <Switch onChange={onPushNotificationsChange} key={switchKey} value={pushEnabled} checked={pushEnabled} color='var(--success)' label='Enable Push Notifications' />
                {switchKey > 0 && <>
                    <img src="/addressBarArrow.png" className="addressBarArrow" />
                    <img src="/addressBarArrow.png" className="addressBarArrow left" /> </>
                }
            </div>
        </Dialog>
    )
}

export default AskPermissions