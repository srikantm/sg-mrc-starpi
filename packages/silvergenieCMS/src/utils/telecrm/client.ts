import axios, { AxiosInstance } from "axios";

let teleCrmClient: AxiosInstance | null = null;

export function getTeleCrmClient(): AxiosInstance {
  if (!teleCrmClient) {
    const token: string = process.env.TELECRM_TOKEN || "";
    const url: string = process.env.TELECRM_URL || "";

    teleCrmClient = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Telecrm client created!");
  }
  return teleCrmClient;
}
