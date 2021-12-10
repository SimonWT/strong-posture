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

  const notificationsState = getStorage()?.permissions?.notifications ? (isBrowserSupportNotifications ? Notification.permission === 'granted' : false) : false

  const [permissions, setPermissions] = useState({
    notifications: notificationsState,
    sound: getStorage()?.permissions?.sound ?? false,
    video: getStorage()?.permissions?.video ?? false,
    images: getStorage()?.permissions?.images ?? false,
  });

  const updatePermissions = (permissions) => {
    updateStorage('permissions', permissions)
    setPermissions(permissions)
  }

  const [timeIntervals, setTimeIntervals] = useState({
    notifications: getStorage()?.timeIntervals?.notifications ?? 60,
    sound: getStorage()?.timeIntervals?.sound ?? 100,
    video: getStorage()?.timeIntervals?.video ?? 200,
    images: getStorage()?.timeIntervals?.images ?? 20,
  });

  const updateTimeIntervals = (timeIntervals) => {
    updateStorage('timeIntervals', timeIntervals)
    setTimeIntervals(timeIntervals)
  }

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

  const [startTimerOnEnter, setStartTimerOnEnter] = useState(false)

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
              setPermissions={updatePermissions}
              permissions={permissions}
              timeIntervals={timeIntervals}
              setTimeIntervals={updateTimeIntervals}
            />
            {!isLoading
              && <Action permissions={permissions} setPermissions={updatePermissions} timeIntervals={timeIntervals} videoStream={videoStream} settings={settings} increaseExp={increaseExp}  startTimerOnEnter={startTimerOnEnter} setStartTimerOnEnter={setStartTimerOnEnter}/>}
          </Route>
          <Route path="/permissions">
            <Permissions
              setPermissions={updatePermissions}
              permissions={permissions}
              setVideoStream={setVideoStream}
              setStartTimerOnEnter={setStartTimerOnEnter}
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
