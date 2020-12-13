import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import DataChat1 from './components/DataChat1';
import HomePage from './components/HomePage';
import VideoChat from './components/VideoChat';

const Index = () => (
  <Router>
    <div className="container">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/chat">
          <DataChat1 />
        </Route>
        <Route exact path="/video">
          <VideoChat />
        </Route>
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(<Index />, document.getElementById('root'));
