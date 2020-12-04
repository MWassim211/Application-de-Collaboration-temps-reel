import React from 'react';
import ReactDOM from 'react-dom';
import DataChat from './components/DataChat';

const Index = () => (
  <div className="container">
    Hello
    <DataChat />
  </div>
);
ReactDOM.render(<Index />, document.getElementById('root'));
