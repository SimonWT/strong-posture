import { useEffect } from 'react'
import smartlookClient from 'smartlook-client'

const smartAppId = process.env.SMARTLOOK_APP_ID

const useSmartlook = () => {
  useEffect(() => {
      console.log('im here', smartAppId, process.env)
    if (smartAppId && !!window.smartlook && process.env.NODE_ENV === 'production') {
      smartlookClient.init(smartAppId)
      console.log('im here 2', )
    }
  }, [])

  return 
}

export default useSmartlook