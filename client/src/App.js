import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import LoginForm from './Pages/LoginPage';
import Post from './Components/Post';
import Home from './Pages/HomePage';
import Profile from './Pages/ProfilePage';

const App = () => (
  <div className="app-routes">
  <BrowserRouter>
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/" component={LoginForm} />
    </Switch>
  </BrowserRouter>
  </div>
);

export default App;
