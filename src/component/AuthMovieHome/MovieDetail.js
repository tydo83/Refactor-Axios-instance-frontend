import React, { Component } from "react";
import axios from "axios";

export class MovieDetail extends Component {
  state = {
    movieInfo: null,
    friendsArray: [],
    selectFriend: "",
  };

  handleSelectFriend = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount = async () => {
    try {
      let payload = await axios.get(
        `http://omdbapi.com/?apikey=6332b1e1&t=${this.props.match.params.title}&plot=full`
      );

      let jwtToken = localStorage.getItem("jwtToken");

      let friendsArrayPayload = await axios.get(
        "http://localhost:3001/friends/get-all-friends",
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      this.setState({
        movieInfo: payload.data,
        friendsArray: friendsArrayPayload.data.friends,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleSendToFriend = async () => {
    let selectedFriendInfo = this.state.friendsArray.filter(
      (item) => item._id === this.state.selectFriend
    );

    const { Title, Plot, imdbID } = this.state.movieInfo;

    let movieTextInfo = {
      title: Title,
      plot: Plot,
      imdbID: imdbID,
      targetUser: selectedFriendInfo[0],
    };

    try {
      //console.log(movieTextInfo);
      let jwtToken = localStorage.getItem("jwtToken");

      let payload = await axios.post(
        "http://localhost:3001/users/send-sms-movie-to-friend",
        movieTextInfo,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(payload);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    //console.log(this.props.match);
    //console.log(this.state);
    return (
      <>
        {this.state.movieInfo ? (
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <img src={this.state.movieInfo.Poster} alt="something" />
              </div>
              <div className="col-md-6">
                <h1>{this.state.movieInfo.Title}</h1>
                <p>{this.state.movieInfo.Plot}</p>

                {this.state.movieInfo.Ratings.map((item) => {
                  return (
                    <div key={item.Source}>
                      {item.Source}: {item.Value}
                    </div>
                  );
                })}

                <div style={{ marginTop: 50 }}>
                  <a
                    className="btn btn-primary"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.imdb.com/title/${this.state.movieInfo.imdbID}/`}
                  >
                    IMDB Link
                  </a>

                  <span style={{ marginLeft: 15 }}>
                    <label>Please choose a friend</label>
                    <select
                      value={this.state.selectFriend}
                      style={{ marginLeft: 15 }}
                      onChange={this.handleSelectFriend}
                      name="selectFriend"
                    >
                      <option>Pick one</option>
                      {this.state.friendsArray.map((item) => {
                        return (
                          <option key={item._id} value={item._id}>
                            {item.nickName}
                          </option>
                        );
                      })}
                    </select>

                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={this.handleSendToFriend}
                        className="btn btn-success"
                      >
                        Send to frirend
                      </button>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>...Loading</div>
        )}
      </>
    );
  }
}

export default MovieDetail;
