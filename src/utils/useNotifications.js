import { getRandomInt } from './helpers'

const reminderVariants = [
  { text: 'Just remind you', body: 'Keep your posture correctly bruh' },
  { text: 'Straighten up', body: 'Your posture not correct' },
  { text: 'brooo', body: "Don't forget about posture" },
  { text: 'Straighten up', body: 'Your posture not correct' },
  { text: 'Common!', body: 'PPPOOOSSSSTTUUURRREEE' },
]

const useNotifications = () => {
  const notify = (text, body) => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification')
    }

    // Проверка разрешения на отправку уведомлений
    else if (Notification.permission === 'granted') {
      // Если разрешено, то создаём уведомление
      var notification = new Notification(text, { body })
    }
    // В противном случае, запрашиваем разрешение
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // Если пользователь разрешил, то создаём уведомление
        if (permission === 'granted') {
          var notification = new Notification(text, { body })
        }
      })
    }
  }

  const remind = () => {
    const idx = getRandomInt(reminderVariants.length - 1)
    const notification = reminderVariants[idx]
    notify(notification.text, notification.body)
  }

  return [notify, remind]
}

export default useNotifications
