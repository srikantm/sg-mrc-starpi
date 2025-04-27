/**
 * A set of functions called "actions" for `utils`
 */
import {
  generateOTP,
  responseService,
  emailService,
  sendOTP,
} from "../../../utils";
import { EMAIL_VALID_REGEX, MOBILE_VALID_REGEX } from "../../../constants";
import { kebabCase } from "lodash";
import {
  GetValues,
  GetPopulatableKeys,
  GetNonPopulatableKeys,
} from "@strapi/types/dist/types/core/attributes";

const slugify = (text: string) => kebabCase(text.replace(/&/g, "-and-"));
export default {
  generatePdf: async (ctx, next) => {
    const { id } = ctx.request.params;
    const phrData = await strapi
      .service("api::user-detail.user-detail")
      .generateEmergencyPdf(id);

    try {
      ctx.body = phrData;
    } catch (err) {
      ctx.body = err;
    }
  },

  getPdf: async (ctx, next) => {
    const { id } = ctx.request.params;
    // const phrData = await strapi
    //   .service("api::user-detail.user-detail")
    //   .findUserDetails(id);
    const phrData = await strapi
      .service("api::user-detail.user-detail")
      .generateEmergencyPdf(id);
    try {
      // ctx.response.redirect(`/uploads/emergency${phrData.pdfPath}`);
      ctx.response.redirect(
        phrData?.pdfPath
        // getFullUploadPath(phrData?.pdfPath, phrData.user?.email)
      );
    } catch (err) {
      ctx.body = err;
    }
  },

  loginUser: async (ctx, next) => {
    const { email, identifier, password } = ctx.request.body;
    const username = (identifier || email) as string;
    let dummyOtp = false;
    if (username === "kiran123@yoursilvergenie.com") {
      dummyOtp = true;
    }

    // VALIDATIONS
    const me = ctx.state.user;
    if (me) {
      return new responseService(ctx).USER_ALREADY_LOGGEDIN;
    }
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email: username }, { username }, { phoneNumber: username }],
        },
        populate: ["*", "address.*"],
      });
    if (!user) {
      return new responseService(ctx).USER_DOESNT_EXIST;
    }

    // WITH PASSWORD FLOW
    if (password && user.password) {
      const isValidUserPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(password, user.password);
      if (!isValidUserPassword) {
        return new responseService(ctx).INVALID_PASSWORD;
      }
      const JWT = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });
      return new responseService(
        ctx,
        "Logged in successfully",
        "LOGGED_IN_SUCCESS"
      ).OK({
        AUTH_TOKEN: JWT,
      });
    }

    // WITHOUT PASSWORD FLOW
    // sendEmail
    // TODO: remove this dummy otp
    const OTP = dummyOtp ? "1234" : generateOTP(4);
    if (!dummyOtp) {
      if (user.email === username) {
        new emailService({}).sendOtpEmail({
          ToAddresses: [user.email],
          subject: "OTP for Login | Silvergnie",
          otp: OTP,
        });
      }

      if (user.phoneNumber === username) {
        const phoneNumber: string = user.phoneNumber;
        sendOTP(`+${phoneNumber.split(" ").join("")}`, OTP);
      }
    }
    // console.log(OTP);
    strapi
      .service("api::utils.utils")
      .redisSet(username, OTP, {
        EX: 10 * 60,
        // NX: true,
      })
      .then(() => {})
      .catch(() => {});

    return new responseService(
      ctx,
      "OTP Sent Successfully",
      "USER_FOUND_OTP_SENT"
    ).OK({});
  },

  verifyOtp: async (ctx, next) => {
    // console.log(ctx.request.body, "verifyOtp");
    const { email, identifier, otp } = ctx.request.body;
    const username = identifier || email;
    if (username && otp && otp.length === 4) {
      const correctOTP = await strapi
        .service("api::utils.utils")
        .redisGet(username, {});
      if (correctOTP == otp) {
        const user = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where: {
              $or: [
                { email: username },
                { username },
                { phoneNumber: username },
              ],
            },
            populate: ["*", "address.*"],
          });
        const JWT = strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id,
        });
        return new responseService(
          ctx,
          "Logged in successfully",
          "LOGGED_IN_SUCCESS"
        ).OK({
          userDetails: user,
          AUTH_TOKEN: JWT,
        });
      }
    }
    return new responseService(ctx).INVALID_OTP;
  },

  getUserPHR: async (ctx, next) => {
    const me = ctx.state.user;
    if (!me) {
      return new responseService(ctx).USER_NOT_LOGGEDIN;
    }
    const userId = ctx.params.id ?? ctx.params.userId ?? ctx.query.userId;
    const phrData: any = await strapi.db.query("api::phr.phr").findOne({
      where: {
        belongsTo: userId || me.id,
      },
      populate: [
        "prescription.Medicine",
        "prescription.alternateMedicine",
        "prescription.media",
        "documents",
        "address",
        "chronicCondition.condition",
        "vaccineRecords",
        "diagnosedServices.serviceName",
        "diagnosedServices.serviceProvider",
        "diagnosedServices.media",
        "medicalConditions.condition",
        "covidVaccines",
        "allergies",
        "fitnessRegime",
        "belongsTo",
        "createdBy",
        "updatedBy",
      ],
      // populate: "*",
    });
    return new responseService(
      ctx,
      phrData ? "PHR Fetched successfully" : "PHR not found",
      phrData ? "PHR_FETCHED" : "PHR_NOT_FOUND"
    ).OK(phrData);
  },

  getUserEPR: async (ctx, next) => {
    const me = ctx.state.user;
    if (!me) {
      return new responseService(ctx).USER_NOT_LOGGEDIN;
    }
    const userId = ctx.params.id ?? ctx.params.userId ?? ctx.query.userId;
    const eprData = await strapi.db
      .query("api::user-detail.user-detail")
      .findOne({
        where: {
          user: userId || me.id,
        },
        populate: ["emergencyContacts", "UserInsurance", "preferredServices"],
      });
    return new responseService(
      ctx,
      eprData ? "EPR Fetched successfully" : "EPR not found",
      eprData ? "EPR_FETCHED" : "EPR_NOT_FOUND"
    ).OK(eprData);
  },

  registerAppUser: async (ctx, next) => {
    console.log("ctx.request.body", ctx.request.body);
    const { firstName, lastName, dob, email, phoneNumber, profileImg } =
      ctx.request.body;
    const username = `${firstName} ${lastName} ${email}`;
    // VALIDATIONS
    if (
      !EMAIL_VALID_REGEX.test(email?.toLowerCase()) ||
      !MOBILE_VALID_REGEX.test(phoneNumber) ||
      !firstName ||
      !lastName ||
      !dob
    ) {
      return new responseService(ctx).BAD_REQUEST;
    }

    const randomDummyMobile = `91 ${generateOTP(10)}`;

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email }, { username }, { phoneNumber: phoneNumber }],
        },
        populate: ["*", "address.*"],
      });

    if (user) {
      return new responseService(ctx).USER_ALREADY_EXIST;
    }
    const OTP = generateOTP(4);

    new emailService({}).sendOtpEmail({
      ToAddresses: [email],
      subject: "OTP for Login | Silvergnie",
      otp: OTP,
    });

    sendOTP(`+${phoneNumber.split(" ").join("")}`, OTP);

    const redisData = {
      username,
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber,
      dob,
      otp: OTP,
      profileImg,
    };
    strapi.service("api::utils.utils").redisSet(phoneNumber, redisData, {
      EX: 10 * 60,
    });
    strapi.service("api::utils.utils").redisSet(email, redisData, {
      EX: 10 * 60,
    });

    return new responseService(ctx, "OTP Sent Successfully", "OTP_SENT").OK({});
  },

  verifyRegistrationOtp: async (ctx, next) => {
    const { otp, email, phoneNumber } = ctx.request.body;
    if (!otp || (!email && !phoneNumber)) {
      return new responseService(ctx).BAD_REQUEST;
    }
    let userDetails: Record<string, any> = {};
    if (email) {
      userDetails = await strapi
        .service("api::utils.utils")
        .redisGet(email, {});
    }
    if (phoneNumber) {
      userDetails = await strapi
        .service("api::utils.utils")
        .redisGet(phoneNumber, {});
    }
    if (
      (userDetails && Object.keys(userDetails).length === 0) ||
      userDetails.otp != otp
    ) {
      return new responseService(ctx).INVALID_OTP;
    }

    const data = {
      username: userDetails.username,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      dateOfBirth: userDetails.dob,
      uniqueKey: slugify(`${userDetails.email} ${userDetails.firstName}`),
      profileImg: userDetails.profileImg,
      isFamilyMember: false,
      role: {
        set: [1],
      },
    };

    const createdUser = await strapi
      .service("api::user-detail.user-detail")
      .updateOrCreateUser(
        {
          username: userDetails.username,
        },
        data
      );

    const JWT = strapi.plugins["users-permissions"].services.jwt.issue({
      id: createdUser.id,
    });
    return new responseService(
      ctx,
      "Logged in successfully",
      "LOGGED_IN_SUCCESS"
    ).OK({
      AUTH_TOKEN: JWT,
      userDetails: createdUser,
    });
  },

  addFamily: async (ctx, next) => {
    const me = ctx.state.user;
    if (!me) {
      return new responseService(ctx).USER_NOT_LOGGEDIN;
    }
    const { self } = ctx.request.body;

    // VALIDATION
    if (self !== true && self !== false) {
      return new responseService(ctx).BAD_REQUEST;
    }
    const familyData = {
      isActive: true,
      name: `${me.firstName} ${me.lastName} family`,
      users: [],
    };

    const { gender, profileImg, address } = ctx.request.body;

    // first check if the user exists in the family
    const familyUser = await strapi.entityService.findMany(
      "api::family.family",
      {
        filters: {
          users: me.id,
        },
        populate: "*",
      }
    );

    // VALIDATION
    const genderOptions = ["Male", "Female", "Other"];
    if (!genderOptions.includes(gender)) {
      return new responseService(ctx).BAD_REQUEST;
    }
    if (self) {
      // create family with current user details
      let family: GetValues<
        "api::family.family",
        | GetPopulatableKeys<"api::family.family">
        | GetNonPopulatableKeys<"api::family.family">
      >;
      familyData.users.push(me.id);
      if (familyUser.length < 1) {
        family = await strapi.entityService.create("api::family.family", {
          data: familyData,
          populate: "*",
        });
      } else {
        family = familyUser[0];
      }
      await strapi.service("api::user-detail.user-detail").updateOrCreateUser(
        {
          id: me.id,
        },
        {
          relation: "self",
          gender,
          profileImg,
          ...(address && { address }),
          isFamilyMember: true,
        }
      );
      return new responseService(
        ctx,
        "Family saved successfully",
        "SUCCESS"
      ).OK(family);
    }

    const { firstName, lastName, dob, email, phoneNumber, relation } =
      ctx.request.body;

    // VALIDATIONS
    if (
      !EMAIL_VALID_REGEX.test(email?.toLowerCase()) ||
      !MOBILE_VALID_REGEX.test(phoneNumber) ||
      !firstName ||
      !lastName ||
      !dob ||
      !relation
    ) {
      return new responseService(ctx).BAD_REQUEST;
    }

    const username = `${firstName} ${lastName} ${email}`;
    const data = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      dateOfBirth: dob,
      uniqueKey: slugify(`${email} ${firstName}`),
      gender,
      relation,
      profileImg,
      ...(address && { address }),
      isFamilyMember: true,
    };
    const createdUser = await strapi
      .service("api::user-detail.user-detail")
      .updateOrCreateUser(
        {
          username: username,
        },
        data
      );

    // if not then add him too
    if (familyUser.length < 1) {
      familyData.users.push(me.id);
      familyData.users.push(createdUser.id);
      const family = await strapi.entityService.create("api::family.family", {
        data: familyData,
        populate: "*",
      });
      return new responseService(
        ctx,
        "Family saved successfully",
        "SUCCESS"
      ).OK(family);
    }

    const family = await strapi.entityService.update(
      "api::family.family",
      familyUser[0].id,
      {
        data: {
          users: [...familyUser[0].users.map((e) => e.id), createdUser.id],
        },
        populate: "*",
      }
    );
    return new responseService(ctx, "Family saved successfully", "SUCCESS").OK(
      family
    );
  },

  getFamily: async (ctx, next) => {
    const me = ctx.state.user;
    let families = await strapi.entityService.findMany("api::family.family", {
      filters: {
        users: me.id,
      },
      populate: [
        "users.phr.*",
        "users.phr.diagnosedServices.serviceName.*",
        "users.phr.diagnosedServices.serviceProvider.*",
        "users.address.*",
        "users.user_detail.createdAt",
        "users.user_detail.updatedAt",
        "users.care_coach.profileImg",
        "users.profileImg.*",
        "users.subscriptions.*",
        "users.subscriptions.payment_transactions.*",
        "users.subscriptions.benefits.code",
        "users.subscriptions.razorpay_subscription.status",
        "users.subscriptions.product.icon",
        "users.subscriptions.product.*",
        "users.subscriptions.product.prices.*",
      ],
    });

    families = families.map((family) => {
      family.users = family.users.map((user) => {
        if (user.subscriptions.length > 0) {
          user.subscriptions = user.subscriptions.filter(
            (subscription) =>
              subscription.subscriptionStatus === "Active" &&
              subscription.paymentStatus === "paid"
          );
        }
        return user;
      });
      return family;
    });

    return new responseService(
      ctx,
      "Family fetched successfully",
      "SUCCESS"
    ).OK(families);
  },

  updateFamilyMember: async (ctx, next) => {
    console.log("here", ctx.request.body);
    console.log("id", ctx.params.id);
    const id = ctx.params.id;
    const { firstName, lastName, dob, relation, gender, profileImg, address } =
      ctx.request.body;

    // VALIDATIONS
    if (!firstName || !lastName || !dob || !relation || !gender) {
      return new responseService(ctx).BAD_REQUEST;
    }

    const updatedUser = await strapi
      .service("api::user-detail.user-detail")
      .updateOrCreateUser(
        { id },
        {
          firstName,
          lastName,
          dateOfBirth: dob,
          relation,
          gender,
          profileImg,
          ...(address && { address }),
        }
      );
    return new responseService(
      ctx,
      "Family updated successfully",
      "SUCCESS"
    ).OK(updatedUser);
  },
};
