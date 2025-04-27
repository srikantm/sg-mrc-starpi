export default {
  routes: [
    {
      method: "POST",
      path: "/service-tracker/request-new",
      handler: "custom.requestService",
      config: {
        policies: [],
        middlewares: ["api::service-tracker.validate-form-answers"],
      },
    },
    {
      method: "GET",
      path: "/service-tracker/me",
      handler: "custom.me",
    },
  ],
};
