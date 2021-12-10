import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.scss';

import Home from './components/Home';
import Action from './components/Action';
import Permissions from './components/Permissions';
import Header from './components/Header';
import PostureRecognition from './components/PostureRecognition/PostureRecognition';
import TestNotifications from './components/TestNotifications';
import ExpScore from './components/Game/ExpScore';

import useSettings from './utils/useSettings';
import useSmartlook from './utils/useSmartlook';

import { initUser, getStorage, updateStorage } from './utils/userStorage';

const App = (props) => {
  initUser();

  const isBrowserSupportNotifications = ('Notification' in window);

  const [permissions, setPermissions] = useState({
    notifications: isBrowserSupportNotifications ? Notification.permission === 'granted' : false,
    sound: false,
    video: false,
    images: false,
  });

  const [timeIntervals, setTimeIntervals] = useState({
    notifications: 60,
    sound: 100,
    video: 200,
    images: 20,
  });

  const [exp, setExp] = useState(getStorage().exp ?? 0);
  const increaseExp = (value) => {
    setExp(exp => exp + value )
    updateStorage('exp', exp)
  }

  const [settings, setSettings] = useState({
    useStopwatchInsteadOfTimer: false,
  });

  const [isLoading, setLoading] = useState(true);

  const [videoStream, setVideoStream] = useState(undefined);

  useSettings(settings, setSettings, setLoading);
  useSmartlook();

  return (
    <Router>
      {isLoading && <div className="loader-container"><div className="sk-spinner-pulse" /></div>}
      <div className="App">
        <Switch>
          <Route path="/action">
            <ExpScore exp={exp} />
            <Header
              setPermissions={setPermissions}
              permissions={permissions}
              timeIntervals={timeIntervals}
              setTimeIntervals={setTimeIntervals}
            />
            {!isLoading
              && <Action permissions={permissions} setPermissions={setPermissions} timeIntervals={timeIntervals} videoStream={videoStream} settings={settings} increaseExp={increaseExp} />}
          </Route>
          <Route path="/permissions">
            <Permissions
              setPermissions={setPermissions}
              permissions={permissions}
              setVideoStream={setVideoStream}
            />
          </Route>
          <Route path="/test">
            <PostureRecognition showVideo />
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
  );
};

export default App;
