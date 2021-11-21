import { useEffect } from 'react'
import { database } from '../../firebase'
import { ref, onValue } from 'firebase/database'

const useSettings = (settings, setSettings, setLoading) => {
  useEffect(() => {
    if (!database) return
    setLoading(true)
    const settingsRef = ref(database, 'settings')
    onValue(settingsRef, (snapshot) => {
      const data = snapshot.val()
      setSettings({ ...settings, ...data })
      setLoading(false)
    })
    return () => {}
  }, [])
}

export default useSettings
