import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './login.css';
import logo from './logo.png';
//logo: 8ebee8
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      new_username: '',
      new_password: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleLoginSubmit = async e => {
    event.preventDefault();
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.new_username,
        password: this.state.new_password,
        firstname: this.state.firstname,
        lastname: this.state.lastname
      })
    });
    const body = await response.text();
    this.setState({
      responseToPost: body
    });
  }

  handleSignupSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.new_username,
        password: this.state.new_password,
        firstname: this.state.firstname,
        lastname: this.state.lastname
      })
    });
    const body = await response.text();
    this.setState({
      responseToPost: body
    });
  }

  render() {
    return (
      <div className="main">

      <div className="login">
      <img src={logo} className="logo" alt="logo" />
      <form className="login_form" onSubmit={this.handleLoginSubmit.bind(this)}>
        <label className="username_box">
          Username:
          <input type="text" name="username" value={this.state.username.value} onChange={this.handleChange}/>
        </label>
        <label className="password_box">
          Password:
          <input type="password" name="password" value={this.state.password.value} onChange={this.handleChange}/>
        </label>
        <input type="submit" className="login_button" value="Sign In" />
      </form>
      </div>

      <div className="signup">
      <h3>Create New Account</h3>
      <form className="signup_form" onSubmit={this.handleSignupSubmit.bind(this)}>
        <label>
          First Name:
          <input type="text" name="firstname" value={this.state.firstname.value} onChange={this.handleChange}/>
        </label>
        <label>
          Last Name:
          <input type="text" name="lastname" value={this.state.lastname.value} onChange={this.handleChange}/>
        </label>
        <label>
          Create Username:
          <input type="text" name="new_username" value={this.state.new_username.value} onChange={this.handleChange}/>
        </label>
        <label>
          Create Password:
          <input type="text" name="new_password" value={this.state.new_password.value} onChange={this.handleChange}/>
        </label>
        <input type="submit" className="signup_button" value="Sign Up" />
      </form>
      </div>

      </div>
    );
  }
}

export default LoginForm;
