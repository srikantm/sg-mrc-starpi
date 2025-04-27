import { Context } from "koa";

export const ERROR_MESSAGES = {
  USER_NOT_LOGGEDIN: "User is not logged in, please log in to proceed",
  USER_ALREADY_LOGGEDIN: "User is already logged in",
  INVALID_PASSWORD: "Invalid password",
  USER_NOT_ACTIVE: "User is not active",
  USER_DOESNT_EXIST: "User does not exist",
  BAD_REQUEST: "Request is Invalid or Bad Request",
  NOT_FOUND: "Not found",
  INVALID_OTP: "Invalid OTP or User does not exist",
  USER_ALREADY_EXIST: "User already exist",
};

export class responseService {
  private ctx: Context | any;
  private msg: string = undefined;
  private name: string = undefined;
  constructor(ctx, msg?: string | undefined, name?: string | undefined) {
    this.ctx = ctx;
    this.msg = msg;
    this.name = name;
  }

  get USER_NOT_LOGGEDIN() {
    return this.ctx.unauthorized(ERROR_MESSAGES.USER_NOT_LOGGEDIN, {
      name: this.name ?? "USER_NOT_LOGGEDIN",
      message: this.msg ?? ERROR_MESSAGES.USER_NOT_LOGGEDIN,
    });
  }
  get USER_ALREADY_LOGGEDIN() {
    console.log("USER_NOT_LOGGEDIN");

    return this.ctx.badRequest(ERROR_MESSAGES.USER_ALREADY_LOGGEDIN, {
      name: this.name ?? "USER_ALREADY_LOGGEDIN",
      message: this.msg ?? ERROR_MESSAGES.USER_ALREADY_LOGGEDIN,
    });
  }

  get INVALID_PASSWORD() {
    console.log("INVALID_PASSWORD");
    return this.ctx.badRequest(ERROR_MESSAGES.INVALID_PASSWORD, {
      name: this.name ?? "INVALID_PASSWORD",
      message: this.msg ?? ERROR_MESSAGES.INVALID_PASSWORD,
    });
  }

  get USER_NOT_ACTIVE() {
    console.log("USER_NOT_ACTIVE");
    return this.ctx.badRequest(ERROR_MESSAGES.USER_NOT_ACTIVE, {
      name: this.name ?? "USER_NOT_ACTIVE",
      message: this.msg ?? ERROR_MESSAGES.USER_NOT_ACTIVE,
    });
  }

  get USER_DOESNT_EXIST() {
    console.log("USER_DOESNT_EXIST");
    return this.ctx.badRequest(ERROR_MESSAGES.USER_DOESNT_EXIST, {
      name: this.name ?? "USER_DOESNT_EXIST",
      message: this.msg ?? ERROR_MESSAGES.USER_DOESNT_EXIST,
    });
  }

  get USER_ALREADY_EXIST() {
    console.log("USER_ALREADY_EXIST");
    return this.ctx.badRequest(ERROR_MESSAGES.USER_ALREADY_EXIST, {
      name: this.name ?? "USER_ALREADY_EXIST",
      message: this.msg ?? ERROR_MESSAGES.USER_ALREADY_EXIST,
    });
  }

  get BAD_REQUEST() {
    console.log("BAD_REQUEST");
    return this.ctx.badRequest(ERROR_MESSAGES.BAD_REQUEST, {
      name: this.name ?? "BAD_REQUEST",
      message: this.msg ?? ERROR_MESSAGES.BAD_REQUEST,
    });
  }

  get NOT_FOUND() {
    console.log("NOT_FOUND");
    return this.ctx.notFound(ERROR_MESSAGES.NOT_FOUND, {
      name: this.name ?? "NOT_FOUND",
      message: this.msg ?? ERROR_MESSAGES.NOT_FOUND,
    });
  }
  get INVALID_OTP() {
    console.log("INVALID_OTP");
    return this.ctx.badRequest(ERROR_MESSAGES.INVALID_OTP, {
      name: this.name ?? "INVALID_OTP",
      message: this.msg ?? ERROR_MESSAGES.INVALID_OTP,
    });
  }

  OK(data) {
    return this.ctx.send({
      data,
      details: {
        message: this.msg,
        name: this.name,
        status: 200,
      },
      success: true,
    });
  }
}
