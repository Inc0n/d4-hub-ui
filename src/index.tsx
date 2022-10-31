import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './components/main';
import Leaderboard from './components/leaderboard';
import User from './components/user';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <br />
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/user" component={User} />
        </Switch>
      </Router>
    </>
  );
}

render(<App />, document.getElementById('root'));

