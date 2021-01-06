import React from 'react';
import ReactDOM from 'react-dom';

import Home from './components/Home';

// import './css/index.css';
const style = {
  fontSize: '20px',
  textAlign: 'center'
};

const Index = () => (
  <div className="container">
    <h1 style={style}>Demo tp RTC web</h1>
    <div style={{ textAlign: 'center' }}><Home /></div>
  </div>
);

ReactDOM.render(<Index />, document.getElementById('root'));
