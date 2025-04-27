import moment from "moment";
import axios from "axios";
import { getOldUserModel } from "../../../schemas/user";
import { putLeadInTelecrm } from "../../../utils/index";

import { responseService } from "../../../utils";
const scrapFoodDb = (foodDb) => {
  const db = foodDb.map((food) => {
    const numberPattern = /\d+\.?\d*/g;
    const macros = food.macro.replace("<b>", "").replace("</b>", "").split("|");
    // <b> Cal : </b>247.0 | <b> Carbs : </b>81.0 | <b> Pro : </b>4.0 | <b> Fats : </b>1.2 | <b> Fibre : </b>53.0
    return {
      name: food.name,
      calorie: parseFloat(macros[0].match(numberPattern).join(".")),
      protein: parseFloat(macros[2].match(numberPattern).join(".")),
      carbs: parseFloat(macros[1].match(numberPattern).join(".")),
      fibre: parseFloat(macros[4].match(numberPattern).join(".")),
      fats: parseFloat(macros[3].match(numberPattern).join(".")),
    };
  });
};
export default {
  userReport: async (ctx, next) => {
    const { start_date, end_date } = ctx.request.query;
    const services = await strapi.entityService.findMany(
      "api::service.service",
      {}
    );
    const userByServices = [];
    for (const service of services) {
      const users = await strapi.entityService.count(
        "plugin::users-permissions.user",
        {
          filters: {
            user_subscriptions: {
              subscription_plan: {
                service: { name: { $eq: service.name } },
              },
            },
          },
        }
      );
      userByServices.push({ label: service.name, value: users });
    }
    const startDate = start_date
      ? moment(start_date)
      : moment().subtract(30, "days");
    const endDate = end_date ? moment(end_date) : moment();
    const totalUserCount = await strapi.db
      .query("plugin::users-permissions.user")
      .count();
    const userCount = await strapi.db
      .query("plugin::users-permissions.user")
      .count({
        where: {
          $and: [
            { createdAt: { $gte: startDate } },
            { createdAt: { $lte: endDate } },
          ],
        },
      });
    const usersByMonths = [];
    const userByType = [];
    const userTypes = ["classic", "premium", "superPremium"];
    for (let i of userTypes) {
      const userCount = await strapi.db
        .query("plugin::users-permissions.user")
        .count({
          where: { userTags: { $containsi: i } },
        });
      userByType.push({
        label: i,
        value: userCount,
      });
    }
    // const currentMonth = moment().month();
    // const months = moment.monthsShort();
    for (let i = 0; i < 3; i++) {
      const s = moment().subtract(i, "months").startOf("month");
      const e = moment().subtract(i, "months").endOf("month");
      const numberOfUsers = await strapi.db
        .query("plugin::users-permissions.user")
        .count({
          where: {
            $and: [{ createdAt: { $gte: s } }, { createdAt: { $lte: e } }],
          },
        });

      usersByMonths.push({
        label: s.format("MMM"),
        value: numberOfUsers,
      });
    }
    // console.log(
    //   "🚀 ~ file: utils.ts:44 ~ userReport: ~ currentMonth:",
    //   currentMonth
    // );
    try {
      ctx.body = {
        // totalPhr: userCount,
        totalUserCount,
        userByServices,
        usersByMonths,
        userByType,
        query: {
          startDate,
          endDate,
        },
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  paymentReport: async (ctx, next) => {
    const paymentByMonths = [];
    for (let i = 0; i < 3; i++) {
      const s = moment().subtract(i, "months").startOf("month");
      const e = moment().subtract(i, "months").endOf("month");
      const payments = await strapi.db
        .query("api::payment-transaction.payment-transaction")
        .findMany({
          where: {
            $and: [
              { createdAt: { $gte: s } },
              { createdAt: { $lte: e } },
              { status: "SUCCESS" },
            ],
          },
        });
      let wallet = 0;
      let service = 0;
      for (const payment of payments) {
        if (payment.paymentFor == "SERVICE") {
          service = service + payment.value;
        } else if (payment.paymentFor == "WALLET") {
          wallet = wallet + payment.value;
        }
      }

      paymentByMonths.push({
        label: s.format("MMM"),
        value: {
          service,
          wallet,
          total: service + wallet,
        },
      });
    }
    try {
      ctx.body = {
        paymentByMonths,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  serviceReport: async (ctx, next) => {
    const phrByMonths = [];
    const eprByMonths = [];
    for (let i = 0; i < 3; i++) {
      const s = moment().subtract(i, "months").startOf("month");
      const e = moment().subtract(i, "months").endOf("month");
      const phrsCount = await strapi.db.query("api::phr.phr").count({
        where: {
          $and: [{ createdAt: { $gte: s } }, { createdAt: { $lte: e } }],
        },
      });

      phrByMonths.push({
        label: s.format("MMM"),
        value: phrsCount,
      });
    }

    for (let i = 0; i < 3; i++) {
      const s = moment().subtract(i, "months").startOf("month");
      const e = moment().subtract(i, "months").endOf("month");
      const phrsCount = await strapi.db.query("api::phr.phr").count({
        where: {
          $and: [{ createdAt: { $gte: s } }, { createdAt: { $lte: e } }],
        },
      });

      phrByMonths.push({
        label: s.format("MMM"),
        value: phrsCount,
      });
    }
    // const c = await strapi.db
    //   .query("api::user-detail.user-detail")
    //   .deleteMany({ where: { createdAt: { $lte: moment() } } });
    try {
      ctx.body = {
        phrByMonths,
        // c,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  syncUser: async (ctx, next) => {
    const UserRestore = await getOldUserModel({ strapi });
    const allUsers = await axios.get(
      "https://app.yoursilvergenie.com/users?_limit=5000"
    );
    const fUsers = [];
    for (let user of allUsers.data) {
      const { _id, __v, role, ..._user } = user;
      // const _u = new UserRestore({ ..._user, restoreStatus: false });
      fUsers.push({ ..._user, restoreStatus: 0 });
      // await _u.save();
    }
    await UserRestore.insertMany(fUsers);
    return {};
  },
  syncUserWithEmail: async (ctx, next) => {
    // const { email } = ctx.request.query;
    // const UserRestore = await getOldUserModel({ strapi });
    // UserRestore.
    await strapi
      .service("api::utils.oldsync")
      .restoreUser(undefined, ctx.request.query);

    return "SYNCING COMPLETE";
  },

  pushTelecrmLead: async (ctx) => {
    const me = ctx.state.user;
    if (!me) {
      return new responseService(ctx).USER_NOT_LOGGEDIN;
    }
    const { data } = ctx.request.body;

    if (!data) {
      return ctx.badRequest();
    }

    try {
      await putLeadInTelecrm(data);
      /// figuring out the careType from the existing request data we get.
      const careType = data?.actions
        ?.filter(
          (a) =>
            a.type === "SYSTEM_NOTE" && a.text.startsWith("Allied care type:")
        )
        ?.map((action) => action.text.split(": ")[1]?.trim())?.[0];
      if (typeof careType === "string" && careType.length > 1) {
        strapi.entityService.create(
          "api::user-notification.user-notification",
          {
            data: {
              title: `${careType} service requested`,
              message: `Your request for the allied care ${careType} has been recieved.The SG team will be in touch with you shortly`,
              type: "app",
              read: false,
              actionType: "none",
              user: me.id,
              additionalData: [],
            },
            populate: {
              user: true,
              additionalData: true,
              image: true,
            },
          }
        );
      }

      return ctx.send({});
    } catch (e) {
      return ctx.internalServerError();
    }
  },
};
