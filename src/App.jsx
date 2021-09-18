import React from 'react'
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
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/action">
            <Action />
          </Route>
          <Route path="/permissions">
            <Permissions />
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
