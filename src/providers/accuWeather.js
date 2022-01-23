import axios from "axios";
import { BASE_URL } from "../environment";

export const ApiRequest = async (method, url) => {
  let apiResponse = null;
  switch (method) {
    case "post":
      break;
    case "get":
      apiResponse = await axios.get(`${BASE_URL}${url}`);
      break;
    case "put":
      break;
    case "delete":
      break;
    default:
      console.log(`http method not supported`);
  }

  return apiResponse.data;
};
