import jwtDecode from "jwt-decode";
import setAuthToken from "./axios/setAuthToken";

export function checkIsUserLoggedIn() {
  let getJwtToken = localStorage.getItem("jwtToken");

  if (getJwtToken) {
    const currentTime = Date.now() / 1000;

    let decodedJwtToken = jwtDecode(getJwtToken);

    if (decodedJwtToken.exp < currentTime) {
      localStorage.removeItem("jwtToken");
      setAuthToken(null);
      return false;
    } else {
      return true;
    }
  }
}
