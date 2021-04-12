import React, { Component } from "react";
import MainRouter from "./MainRouter";
import { ToastContainer } from "react-toastify";
import jwtDecode from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

import setAuthToken from "./component/lib/axios/setAuthToken";

export class App extends Component {
  state = {
    user: null,
  };

  componentDidMount() {
    // console.log("--------");
    // console.log(process.env);
    // console.log("==========");
    // console.log(process.env.NODE_ENV);

    let getJwtToken = localStorage.getItem("jwtToken");

    //console.log(getJwtToken);
    if (getJwtToken) {
      const currentTime = Date.now() / 1000;

      let decodedJwtToken = jwtDecode(getJwtToken);

      if (decodedJwtToken.exp < currentTime) {
        //
        this.handleUserLogout();
      } else {
        this.handleUserLogin(decodedJwtToken);
      }
      //if (currentTime > decodedJwtToken.exp){}
    }
  }

  handleUserLogin = (user) => {
    this.setState({
      user: {
        email: user.email,
      },
    });
  };

  handleUserLogout = () => {
    localStorage.removeItem("jwtToken");
    setAuthToken(null);
    this.setState({
      user: null,
    });
  };

  render() {
    return (
      <>
        <ToastContainer />
        <MainRouter
          user={this.state.user}
          handleUserLogin={this.handleUserLogin}
          handleUserLogout={this.handleUserLogout}
        />
      </>
    );
  }
}

//only one export default for each file
export default App;
