/**
 * notification service
 */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import { EmailDataType } from "../../../utils";

const sesClient = new SESClient({
  region: process.env.SES_REGION,
});

export default () => ({
  sendEmail: async (options: EmailDataType) => {
    const {
      ToAddresses,
      CcAddresses,
      fromAddress,
      htmlContent,
      textContent,
      subject,
    } = options;
    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        CcAddresses,
        ToAddresses,
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlContent || "HTML_FORMAT_BODY",
          },
          Text: {
            Charset: "UTF-8",
            Data: textContent || htmlContent || "TEXT_FORMAT_BODY",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject || "EMAIL_SUBJECT",
        },
      },
      Source:
        fromAddress ??
        process.env.ADMIN_EMAIL_ADDRESS ??
        "geniecare@yoursilvergenie.com",
      ReplyToAddresses: [
        fromAddress ??
          process.env.ADMIN_EMAIL_ADDRESS ??
          "geniecare@yoursilvergenie.com",
      ],
    });
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (e) {
      console.error("Failed to send email.", e);
      return e;
    }
  },
});
