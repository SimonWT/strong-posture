import { useEffect } from 'react'
import smartlookClient from 'smartlook-client'

const smartAppId = import.meta.env.VITE_SMARTLOOK_APP_ID

const useSmartlook = () => {
  useEffect(() => {
    if (
      smartAppId &&
      import.meta.env.MODE === 'production'
    ) {
      console.log('Smartlook connected')
      smartlookClient.init(smartAppId)
    }
  }, [])

  return
}

export default useSmartlook
