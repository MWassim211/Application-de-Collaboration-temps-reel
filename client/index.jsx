import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import DataChat from './components/datachat/DataChat';
import HomePage from './components/HomePage';
import VideoChat from './components/videochat/VideoChat';

const Index = () => (
  <Router>
    <div className="container">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/chat">
          <DataChat />
        </Route>
        <Route exact path="/video">
          <VideoChat />
        </Route>
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(<Index />, document.getElementById('root'));
