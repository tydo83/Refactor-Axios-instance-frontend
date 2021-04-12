import Axios from "./Axios";

const setAuthToken = (jwtToken) => {
  console.log("===");
  console.log(jwtToken);
  if (jwtToken) {
    Axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
  } else {
    delete Axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
