import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./component/Home";
import Login from "./component/Login/Login";
import SignUp from "./component/SignUp/SignUp";
import AuthMovieHome from "./component/AuthMovieHome/AuthMovieHome";
import Navbar from "./component/Navbar/Navbar";
import NotFound from "./component/NotFound/NotFound";
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";
import MovieDetail from "./component/AuthMovieHome/MovieDetail";
import Profile from "./component/Profile/Profile";
import CreateFriend from "./component/CreateFriend/CreateFriend";

const MainRouter = (props) => {
  return (
    <Router>
      <Navbar user={props.user} handleUserLogout={props.handleUserLogout} />
      <Switch>
        <PrivateRoute
          exact
          path="/movie-detail/:title"
          component={MovieDetail}
        />

        <PrivateRoute exact path="/movie-home" component={AuthMovieHome} />

        <PrivateRoute
          exact
          path="/profile"
          component={Profile}
          handleUserLogout={props.handleUserLogout}
        />

        <PrivateRoute exact path="/create-friend" component={CreateFriend} />

        <Route exact path="/sign-up" component={SignUp} />

        <Route
          exact
          path="/login"
          render={(routerProps) => (
            <Login {...routerProps} handleUserLogin={props.handleUserLogin} />
          )}
        />

        <Route exact path="/" component={Home} />

        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default MainRouter;
