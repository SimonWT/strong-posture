import React from 'react'
import ReactDOM from 'react-dom'
import './assets/index.scss'
import 'ui-neumorphism/dist/index.css'
import App from './App'

import { initAmplitude } from './utils/amplitude'

initAmplitude()

console.log('env secret', import.meta.env)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)