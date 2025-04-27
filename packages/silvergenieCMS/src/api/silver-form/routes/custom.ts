export default {
  routes: [
    {
      method: "GET",
      path: "/forms/csv/:id",
      handler: "custom.generateCSV",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
