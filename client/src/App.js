import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import LoginForm from './login';
import Post from './Post';
import Home from './Home';

const App = () => (
  <div className="app-routes">
  <BrowserRouter>
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/" component={LoginForm} />
    </Switch>
  </BrowserRouter>
  </div>
);

export default App;
