import twilio, { Twilio } from "twilio";

let twilioClient: Twilio | null = null;

export function getTwilioClient(): Twilio {
  if (!twilioClient) {
    const accountSid: string = process.env.TWILIO_ACCOUNT_SID || "";
    const authToken: string = process.env.TWILIO_AUTH_TOKEN || "";

    twilioClient = twilio(accountSid, authToken);
    console.log("Twilio client created!");
  }
  return twilioClient;
}
