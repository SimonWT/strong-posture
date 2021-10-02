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


function App () {

  const [permissions, setPermissions] = useState({
    notifications: false,
    sound: false,
    video: false,
    images: false
  })

  const [timeIntervals, setTimeIntervals] = useState({
    notifications: 300,
    sound: 100,
    video: 200,
    images: 20
  })

  const [audioContext, setAudioContext] = useState(undefined)
  const [videoStream, setVideoStream] = useState(undefined)

  return (
    <Router>
      <div className="App">
        <Header 
          setPermissions={setPermissions}
          permissions={permissions}
          timeIntervals={timeIntervals}
          setTimeIntervals={setTimeIntervals} 
          setAudioContext={setAudioContext}
        />
        <Switch>
          <Route path="/action">
            <Action permissions={permissions} timeIntervals={timeIntervals} audioContext={audioContext} setAudioContext={setAudioContext}  videoStream={videoStream}/>
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
            <PostureRecognition />
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
