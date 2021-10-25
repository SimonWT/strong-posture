import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.scss'

import Home from './components/Home'
import Action from './components/Action'
import Permissions from './components/Permissions'
import Header from './components/Header'
import PostureRecognition from './components/PostureRecognition/PostureRecognition'
import TestNotifications from './components/TestNotifications'


function App (props) {

  const isBrowserSupportNotifications = ("Notification" in window) ? true : false

  const [permissions, setPermissions] = useState({
    notifications: isBrowserSupportNotifications ? Notification.permission === 'granted' : false,
    sound: false,
    video: false,
    images: false
  })

  const [timeIntervals, setTimeIntervals] = useState({
    notifications: 60,
    sound: 100,
    video: 200,
    images: 20
  })

  const [audioContext, setAudioContext] = useState(undefined)
  const [videoStream, setVideoStream] = useState(undefined)

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/action">
            <Header
              setPermissions={setPermissions}
              permissions={permissions}
              timeIntervals={timeIntervals}
              setTimeIntervals={setTimeIntervals}
              setAudioContext={setAudioContext}
            />
            <Action permissions={permissions} setPermissions={setPermissions} timeIntervals={timeIntervals} audioContext={audioContext} setAudioContext={setAudioContext} videoStream={videoStream} />
          </Route>
          <Route path="/permissions">
            <Permissions
              setPermissions={setPermissions}
              permissions={permissions}
              audioContext={audioContext}
              setAudioContext={setAudioContext}
              setVideoStream={setVideoStream}
            />
          </Route>
          <Route path="/test">
            <PostureRecognition showVideo={true} />
          </Route>
          <Route path="/testNotifications">
            <TestNotifications />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>

      </div>
    </Router>
  )
}

export default App
