import React, { Component } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      errorObj: {},
      disabledSubmitButton: true,
    };
    this._isMounted = true;
    this.onChangeDebounce = debounce(this.onChangeDebounce, 1000);
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      //make put request to the server
      let getJwtTokenFromStorage = localStorage.getItem("jwtToken");

      let decodedJwtToken = jwtDecode(getJwtTokenFromStorage);

      let success = await axios.put(
        "http://localhost:3001/users/update-user-password",
        {
          email: decodedJwtToken.email,
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
        }
      );

      if (success.data.payload) {
        //localStorage.removeItem("jwtToken");
        this.props.handleUserLogout();
        this.props.history.push("/login");
      }
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

  onChangeDebounce = () => {
    let errorObj = {};

    if (this.state.newPassword !== this.state.confirmNewPassword) {
      errorObj.checkConfirmPassword = "Sorry, Your password does not match!";
    }

    // if (!isStrongPassword(this.state.password)) {
    //   errorObj.checkPasswordStrength =
    //     "Password must be 8 characters long + 1 uppercase + 1 lowercase + special characters !@#$%^&*()";
    // }

    if (Object.keys(errorObj).length > 0) {
      console.log("----");
      this.setState({
        isError: true,
        errorObj: errorObj,
      });
    } else {
      console.log("78 I am here");
      this.setState({
        isError: false,
        errorObj: {},
      });
    }
  };

  handleOnPasswordChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (this.state.newPassword === this.state.confirmNewPassword) {
          this.setState({
            disabledSubmitButton: false,
          });
        } else {
          this.setState({
            disabledSubmitButton: true,
          });
        }
        // this.onChangeDebounce();

        if (this._isMounted) {
          this.onChangeDebounce();
        }
      }
    );
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleOldPasswordChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  showErrorMessageObj = () => {
    let errorMessageArray = Object.values(this.state.errorObj);

    return errorMessageArray.map((errorMessage, index) => {
      return (
        <div key={index} className="alert alert-danger">
          {errorMessage}
        </div>
      );
    });
  };

  render() {
    const {
      newPassword,
      confirmNewPassword,
      oldPassword,
      isError,
    } = this.state;

    return (
      <div className="form-body">
        <main className="form-signin">
          {isError && this.showErrorMessageObj()}
          <form onSubmit={this.handleOnSubmit}>
            <h1 className="h3 mb-3 fw-normal">Change your password</h1>

            <label htmlFor="oldPassword" className="visually-hidden">
              Old Password
            </label>

            <input
              //type="password"
              type="text"
              id="oldPassword"
              className="form-control"
              placeholder="Old Password"
              required
              name="oldPassword"
              value={oldPassword}
              onChange={this.handleOldPasswordChange}
            />

            <br />

            <label htmlFor="inputPassword" className="visually-hidden">
              New Password
            </label>
            <input
              //type="password"
              type="text"
              id="inputPassword"
              className="form-control"
              placeholder="New Password"
              required
              name="newPassword"
              value={newPassword}
              onChange={this.handleOnPasswordChange}
            />
            <label htmlFor="inputConfirmPassword" className="visually-hidden">
              Confirm New Password
            </label>
            <input
              //type="password"
              type="text"
              id="inputConfirmPassword"
              className="form-control"
              placeholder="Confirm New Password"
              required
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={this.handleOnPasswordChange}
            />
            <button
              className="w-100 btn btn-lg btn-primary"
              type="submit"
              //disabled={isError ? true : false}
              disabled={this.state.disabledSubmitButton}
            >
              Change Password
            </button>
          </form>
        </main>
        ;
      </div>
    );
  }
}

export default Profile;
