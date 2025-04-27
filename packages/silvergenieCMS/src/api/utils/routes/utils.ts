export default {
  routes: [
    {
      method: "GET",
      path: "/utils/reports/user",
      handler: "utils.userReport",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/utils/reports/payment",
      handler: "utils.paymentReport",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/utils/reports/service",
      handler: "utils.serviceReport",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/utils/sync/user",
      handler: "utils.syncUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/telecrm/leads",
      handler: "utils.pushTelecrmLead",
    },
    {
      method: "GET",
      path: "/utils/sync/userwithfilter/",
      handler: "utils.syncUserWithEmail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
