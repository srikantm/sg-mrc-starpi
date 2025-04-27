import { getCompiledHtml } from "../handlebars";
export interface EmailDataType {
  ToAddresses: string[];
  CcAddresses?: string[];
  fromAddress?: string;
  htmlContent?: string;
  textContent?: string;
  subject: string;
}
export class emailService {
  template: string;

  constructor({ ...args }) {}

  async sendOtpEmail(data: EmailDataType & { otp: string }) {
    const contextData: EmailDataType | any = {
      ...data,
    };
    const template = this.template || "/src/templates/email/otp.html";
    const htmlContent = await getCompiledHtml(template, contextData);
    const emailSuccess = await strapi
      .service("api::notification.notification")
      .sendEmail({ ...contextData, htmlContent });
  }
}

export const isTestEmail = (email) => {
  if (!email) {
    return false;
  }
  const testEmailSlangs = ["sg.com", "test.com", "sgtest.com", "temp.com"];
  for (let i = 0; i < testEmailSlangs.length; i++) {
    if (email.includes(testEmailSlangs[i])) {
      return true;
    }
  }
  return false;
};
