import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './login.css';
import logo from './logo.png';
//logo: 8ebee8
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    alert("Signed In");
    event.preventDefault();
  }

  render() {
    return (
      <div className="login">
      <img src={logo} className="logo" alt="logo" />
      <form className="form" onSubmit={this.handleSubmit}>
        <label className="username_box">
          Username:
          <input type="text" name="username" value={this.state.username.value} onChange={this.handleChange}/>
        </label>
        <label className="password_box">
          Password:
          <input type="password" name="password" value={this.state.password.value} onChange={this.handleChange}/>
        </label>
        <input type="submit" value="Sign In" />
      </form>
      </div>
    );
  }
}

export default LoginForm;
