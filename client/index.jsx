import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import DataChat from './components/DataChat';
import HomePage from './components/HomePage';

const Index = () => (
  <Router>
    <div className="container">
      <HomePage />
      <Switch>
        <Route exact path="/chat">
          <DataChat />
        </Route>
        <Route exact path="/video">
          <p> hello </p>
        </Route>
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(<Index />, document.getElementById('root'));
