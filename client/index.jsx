import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import DataChat from './components/DataChat';
import HomePage from './components/HomePage';
import Video from './components/Video';

const Index = () => (
  <Router>
    <div className="container">
      <HomePage />
      <Switch>
        <Route exact path="/chat">
          <DataChat />
        </Route>
        <Route exact path="/video">
          <Video />
        </Route>
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(<Index />, document.getElementById('root'));
