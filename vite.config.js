import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig({
  plugins: [reactRefresh(), EnvironmentPlugin(['NODE_ENV', 'FIREBASE_API_KEY', 'SMARTLOOK_APP_ID'])],
  define: {
    'process.env': {},
  },
  // optimizeDeps: {
  //   include: ['@tensorflow-models/posenet']
  // },
  // server: {
  //   host: '0.0.0.0'
  // }
})
