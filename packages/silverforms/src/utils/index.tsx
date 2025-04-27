import { API_TOKEN } from "@src/constants";
import axios from "axios";

export const authHeaders = {
  authorization: "Bearer " + API_TOKEN,
};
export const getAxiosInstance = (baseURL: string | undefined = undefined) => {
  const instance = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true,
  });

  instance.interceptors.request.use((req: any) => {
    if (req.headers) {
      req.headers = { ...req.headers, ...authHeaders };
    } else {
      req.headers = authHeaders;
    }
    return req;
  });

  return instance;
};
