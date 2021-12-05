import { useEffect } from 'react'
import smartlookClient from 'smartlook-client'

const smartAppId = '3c69b42fa69a18b1e00c837f070776e7a86b9068'

const useSmartlook = () => {
  useEffect(() => {
    if (smartAppId && !!window.smartlook && import.meta.env.NODE_ENV === 'production') {
      smartlookClient.init(smartAppId)
    }
  }, [])

  return 
}

export default useSmartlook