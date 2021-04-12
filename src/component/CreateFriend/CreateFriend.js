import React, { Component } from "react";
import axios from "axios";
import Axios from "../lib/axios/Axios";
export class CreateFriend extends Component {
  state = {
    firstName: "",
    lastName: "",
    friendMobileNumber: "",
    nickName: "",
    isError: false,
    errorObj: {},
    isLoading: false,
    friendsArray: [],
  };

  componentDidMount = async () => {
    this.setState({
      isLoading: true,
    });

    try {
      let jwtToken = localStorage.getItem("jwtToken");
      // let payload = await axios.get(
      //   "http://localhost:3001/friends/get-all-friends",
      //   {
      //     headers: {
      //       authorization: `Bearer ${jwtToken}`,
      //     },
      //   }
      // );

      let payload = await Axios.get("/friends/get-all-friends");

      this.setState({
        isLoading: false,
        friendsArray: payload.data.friends,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleCreateFriend = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleOnSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, friendMobileNumber, nickName } = this.state;
    let jwtToken = localStorage.getItem("jwtToken");
    try {
      let payload = await Axios.post(
        "/friends/create-friend",
        {
          firstName,
          lastName,
          mobileNumber: friendMobileNumber,
          nickName,
        },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      let newFriendsArray = [...this.state.friendsArray, payload.data];

      this.setState({
        firstName: "",
        lastName: "",
        friendMobileNumber: "",
        nickName: "",
        friendsArray: newFriendsArray,
      });
    } catch (e) {
      console.log(e.response);
    }
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

  showFriendsArray = () => {
    return this.state.friendsArray.map((item) => {
      return (
        <tr key={item._id}>
          <td>{item.firstName}</td>
          <td>{item.firstName}</td>
          <td>{item.nickName}</td>
          <td>{item.mobileNumber}</td>
        </tr>
      );
    });
  };

  render() {
    const {
      firstName,
      lastName,
      friendMobileNumber,
      nickName,
      isError,
    } = this.state;

    return (
      <>
        <div className="form-body">
          <main className="form-signin">
            {isError && this.showErrorMessageObj()}

            <form onSubmit={this.handleOnSubmit}>
              <h1 className="h3 mb-3 fw-normal">Please Create Friend</h1>
              <label htmlFor="inputFirstName" className="visually-hidden">
                First Name
              </label>
              <input
                type="text"
                id="inputFirstName"
                className="form-control"
                placeholder="First Name"
                required
                autoFocus
                name="firstName"
                value={firstName}
                onChange={this.handleCreateFriend}
                pattern="[A-Za-z]*"
              />
              <label htmlFor="inputLastName" className="visually-hidden">
                Last Name
              </label>
              <input
                type="text"
                id="inputLastName"
                className="form-control"
                placeholder="Last Name"
                required
                autoFocus
                name="lastName"
                value={lastName}
                onChange={this.handleCreateFriend}
                pattern="[A-Za-z]*"
              />

              <label htmlFor="inputNickname" className="visually-hidden">
                Nickname
              </label>
              <input
                type="text"
                id="inputNickname"
                className="form-control"
                placeholder="Nickname"
                required
                autoFocus
                name="nickName"
                value={nickName}
                onChange={this.handleCreateFriend}
                pattern="[A-Za-z]*"
              />

              <label
                htmlFor="inputFriendMobileNumber"
                className="visually-hidden"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="inputFriendMobileNumber"
                className="form-control"
                placeholder="Friend Mobile Number"
                required
                autoFocus
                name="friendMobileNumber"
                value={friendMobileNumber}
                onChange={this.handleCreateFriend}
              />

              <button
                className="w-100 btn btn-lg btn-primary"
                type="submit"
                disabled={isError ? true : false}
              >
                Create Friend
              </button>
            </form>
          </main>
          ;
        </div>

        <div>
          {this.state.isLoading ? (
            <span>...loading</span>
          ) : (
            <div style={{ textAlign: "center" }}>
              <table style={{ margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>First Name</th>
                    <th>Last Name</th>
                    <th>Nickname</th>
                    <th>Mobile Number</th>
                  </tr>

                  {this.showFriendsArray()}
                </thead>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default CreateFriend;
