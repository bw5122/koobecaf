import React, { Component } from "react";
import ReactDOM from "react-dom";
import "../Styles/login.css";
import logo from "../Assets/logo.png";
import { Redirect, withRouter } from "react-router-dom";

//logo: 8ebee8
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // all fields limit length to 20 characters
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      new_username: "",
      new_password: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleLoginSubmit = e => {
    e.preventDefault();
    const user = this.state.username;
    const pw = this.state.password;
    if (user.length === 0 || pw.length === 0) {
      alert("Empty field. Please try again.");
      return;
    }
    console.log("login submit");
    /* change from /user/login to /login for testing */
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
          alert("username or password incorrect");
        } else {
          this.props.history.push({
            pathname: "/home",
            state: {
              userInfo: res.data
            }
          });
        }
      });

    /*  .then(res => res.json())
          .then(
            (result) => {
              this.props.history.push({
                pathname:"/home",
                state: {
                  firstname: result.firstname,
                  lastname: result.lastname,
                  userID: result.userID
                }
              });
            },
            (error) => {
              alert("error");
            }
          )*/
  };

  handleDumbLogin = e => {
    e.preventDefault();
    const user = this.state.username;
    const pw = this.state.password;
    if (user.length === 0 || pw.length === 0) {
      alert("Empty field. Please try again.");
      return;
    }
    this.props.history.push({
      pathname: "/home",
      state: {
        username: "User1"
      }
    });
  };

  handleSignupSubmit = e => {
    e.preventDefault();
    fetch("/user/signup", {
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
    })
      .then(res => res.json())
      .then(
        result => {
          this.props.history.push({
            pathname: "/home",
            state: {
              firstname: result.firstname,
              lastname: result.lastname,
              userID: result.userID
            }
          });
        },
        error => {
          alert("Error! Please try again.");
        }
      );
  };

  render() {
    return (
      <div className="main">
        <div className="login">
          <img src={logo} className="logo" alt="logo" />
          <form
            className="login_form"
            onSubmit={this.handleLoginSubmit.bind(this)}
          >
            <label className="username_box">
              Username:
              <input
                type="text"
                name="username"
                value={this.state.username.value}
                onChange={this.handleChange}
                maxLength="20"
              />
            </label>{" "}
            <label className="password_box">
              Password:
              <input
                type="password"
                name="password"
                value={this.state.password.value}
                onChange={this.handleChange}
                maxLength="20"
              />
            </label>{" "}
            <input type="submit" className="login_button" value="Sign In" />
          </form>{" "}
        </div>

        <div className="signup">
          <h3> Create New Account </h3>{" "}
          <form
            className="signup_form"
            onSubmit={this.handleSignupSubmit.bind(this)}
          >
            <label>
              First Name:
              <input
                type="text"
                name="firstname"
                value={this.state.firstname.value}
                onChange={this.handleChange}
                maxLength="20"
              />
            </label>{" "}
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={this.state.lastname.value}
                onChange={this.handleChange}
                maxLength="20"
              />
            </label>{" "}
            <label>
              Create Username:
              <input
                type="text"
                name="new_username"
                value={this.state.new_username.value}
                onChange={this.handleChange}
                maxLength="20"
              />
            </label>{" "}
            <label>
              Create Password:
              <input
                type="text"
                name="new_password"
                value={this.state.new_password.value}
                onChange={this.handleChange}
                maxLength="20"
              />
            </label>{" "}
            <input type="submit" className="signup_button" value="Sign Up" />
          </form>{" "}
        </div>
      </div>
    );
  }
}

export default withRouter(LoginForm);
