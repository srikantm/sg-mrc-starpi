import axios from "axios";

import { getTwilioClient } from "./twilioClient";

export const sendLocalSMS = async (message, numbers) => {
  const apiKey = process.env?.TEXTLOCAL_API_KEY;

  if (!apiKey) {
    console.error("Failed to send SMS:", "text_local api key not found!");
  }
  const sender = "Silvergenie";
  const url = `https://api.textlocal.in/send/?apikey=${encodeURIComponent(
    apiKey
  )}&numbers=${encodeURIComponent(numbers)}&message=${encodeURIComponent(
    message
  )}&sender=${encodeURIComponent(sender)}`;

  try {
    await axios.get(url);
    return;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return;
  }
};

export function sendInternationalSMS(to: string, body: string): void {
  const client = getTwilioClient();
  client.messages
    .create({
      to,
      from: "YOUR_TWILIO_PHONE_NUMBER",
      body,
    })
    .then((message) => console.log("Message sent! Message SID:", message.sid))
    .catch((error) => console.error("Failed to send SMS:", error));
}

export const sendOTP = (mobile, otp) => {
  const authKey = process.env.MSG91_AUTH_KEY || "";
  const templateId = process.env.MSG91_AUTH_TEMPLATE_ID || "";
  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/otp",
    params: {
      otp: otp,
      template_id: templateId,
      mobile: mobile,
      authkey: authKey,
      realTimeResponse: "1",
    },
    headers: { "Content-Type": "application/JSON" },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};
