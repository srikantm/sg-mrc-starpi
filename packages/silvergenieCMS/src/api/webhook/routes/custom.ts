export default {
  routes: [
    {
      method: "POST",
      path: "/webhook",
      handler: "custom.webhook",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
