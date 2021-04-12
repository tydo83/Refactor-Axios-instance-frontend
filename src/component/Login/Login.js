import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import { checkIsUserLoggedIn } from "../lib/helpers";
import Axios from "../lib/axios/Axios";
import setAuthToken from "../lib/axios/setAuthToken";

export class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  componentDidMount() {
    if (checkIsUserLoggedIn()) {
      this.props.history.push("/movie-home");
    } else {
      this.props.history.push("/login");
    }
  }

  handleLogin = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      // let result = await axios.post("http://localhost:3001/users/login", {
      //   email: this.state.email,
      //   password: this.state.password,
      // });

      let result = await Axios.post("/users/login", {
        email: this.state.email,
        password: this.state.password,
      });

      localStorage.setItem("jwtToken", result.data.jwtToken);

      setAuthToken(result.data.jwtToken);

      let decodedJWTToken = jwtDecode(result.data.jwtToken);
      //console.log(decodedJWTToken);
      //console.log(decodedJWToken);
      this.props.handleUserLogin(decodedJWTToken);

      this.props.history.push("/movie-home");
    } catch (e) {
      toast.error(e.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  render() {
    const { email, password } = this.state;
    //console.log(this.props);
    return (
      <div className="form-body">
        <main className="form-signin">
          <form onSubmit={this.handleLoginSubmit}>
            <h1 className="h3 mb-3 fw-normal">Please login</h1>

            <label htmlFor="inputEmail" className="visually-hidden">
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              className="form-control"
              placeholder="Email address"
              required
              autoFocus
              name="email"
              value={email}
              onChange={this.handleLogin}
            />

            <label htmlFor="inputPassword" className="visually-hidden">
              Password
            </label>
            <input
              //type="password"
              type="text"
              id="inputPassword"
              className="form-control"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={this.handleLogin}
            />
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Login
            </button>
          </form>
        </main>
      </div>
    );
  }
}

export default Login;
