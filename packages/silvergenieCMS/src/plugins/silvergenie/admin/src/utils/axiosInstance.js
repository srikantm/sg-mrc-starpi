import axios from "axios";

export const authHeaders = {
  authorization:
    "Bearer " +
    "b0af5208e2b641f1e0c8c58ccd38f51f58f098995b2e412751c26953885cfe1fd9de49249865b6876c0fa79c40c500e4aa20970206bc171b5e292be3aea7f227c5e9308d18326371d8379ba2d10af11623d669685633cab31cfc496000d012e65f67f583222efa138e05d52d5e374a5b84ce88535f1db4890194a090bdfcd2a5",
};
export const axiosInterceptorInstance = (baseURL = undefined) => {
  const instance = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true,
  });

  instance.interceptors.request.use((req) => {
    if (req.headers) {
      if (baseURL) {
        req.url = `${baseURL}${req.url}`;
      }
      req.headers = { ...req.headers, ...authHeaders };
    } else {
      req.headers = authHeaders;
    }
    return req;
  });

  return instance;
};
const axiosInstance = axiosInterceptorInstance();
export default axiosInstance;
