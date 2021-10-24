import React, { useEffect, useState } from 'react'
import { getRandomInt } from './helpers'

const reminderVariants = [
  { text: 'Just remind you', body: 'Keep your posture correctly bruh' },
  { text: 'Straighten up', body: 'Your posture not correct' },
  { text: 'brooo', body: "Don't forget about posture" },
  { text: 'Straighten up', body: 'Your posture not correct' },
  { text: 'Common!', body: 'PPPOOOSSSSTTUUURRREEE' },
]

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register(
    'serviceWorker.js'
  ) //notice the file name
  return swRegistration
}

const useNotifications = (isSwEnabled) => {
  const [swRegistration, setSwRegistration] = useState(undefined)

  useEffect(async () => {
    if (isSwEnabled) {
      const registration = await registerServiceWorker()
      setSwRegistration(registration)
      console.log(registration)
    }
  }, [])

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    console.log('requestPermission', permission)
    return permission
  }

  const getPermission = () => Notification.permission

  const showNotification = (title, options) => {
    if (
      isSwEnabled &&
      swRegistration &&
      swRegistration.showNotification
    ) {
      return swRegistration.showNotification(title, options)
    } else return new Notification(title, options)
  }

  const notify = async (text, body) => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification')
    }
    // Проверка разрешения на отправку уведомлений
    else if (getPermission() === 'granted') {
      // Если разрешено, то создаём уведомление
      showNotification(text, { body })
    }
    // В противном случае, запрашиваем разрешение
    else if (getPermission() !== 'denied') {
      const permission = await requestPermission()
      if (permission === 'granted') {
        showNotification(text, { body })
      }
    }
  }

  const notifySw = (title, body) => {
    const options = {
      body,
    }
    swRegistration.showNotification(title, options)
  }

  const remind = () => {
    const idx = getRandomInt(reminderVariants.length - 1)
    const notification = reminderVariants[idx]
    notify(notification.text, notification.body)
  }

  return [notify, remind, requestPermission, getPermission, notifySw]
}

export default useNotifications
