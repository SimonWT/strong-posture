import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css'

import Home from './components/Home'
import Action from './components/Action'
import Permissions from './components/Permissions'


function App () {

  const [permissions, setPermissions] = useState({ 
    notifications: false,
    sound: false,
    video: false,
    images: false
   })  

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/action">
            <Action permissions={permissions} />
          </Route>
          <Route path="/permissions">
            <Permissions setPermissions={setPermissions} permissions={permissions} />
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
