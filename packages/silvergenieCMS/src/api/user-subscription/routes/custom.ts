export default {
  routes: [
    {
      method: "POST",
      path: "/create-subscription",
      handler: "custom.createSubscription",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/all-subscription",
      handler: "custom.getSubscription",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
