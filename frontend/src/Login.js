import React, { Component } from 'react';
import './Login.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let button = event.nativeEvent.submitter.name;
    let username = this.state.username;
    let password = this.state.password;

    if (button === "login") {
      if (username != null && password !=null) {
        // alert(`username: ${username}\n password: ${password}`)
        fetch('/user/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            username : username,
            password : password 
          })
        })
        .then((response) => response.text())
        .then((text) => {
          alert(text);
        })
        .catch((error) => {
          console.error(error);
        });
      } else{
        alert("fill all field!")
      }
    } else if(button === "register"){
      if (username != null && password !=null) {
        // alert(`username: ${username}\n password: ${password}`)
        fetch('/user/auth', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            username : username,
            password : password 
          })
        })
        .then((response) => response.text())
        .then((text) => {
          alert(text);
        })
        .catch((error) => {
          console.error(error);
        });
      } else{
        alert("fill all field!")
      }
    }
  }

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  render() {
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit} >
          <label>Username</label>
          <input onChange={this.handleChange} name="username" type="text"/>
          <br />
          <label>Password</label>
          <input onChange={this.handleChange} name="password" type="password"/>
          <br />
          <button name="login" type="submit">Login</button>
          <button name="register" type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default App;