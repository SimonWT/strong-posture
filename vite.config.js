import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  plugins: [reactRefresh()],
  // optimizeDeps: {
  //   include: ['@tensorflow-models/posenet']
  // },
  // server: {
  //   host: '0.0.0.0'
  // }
})
