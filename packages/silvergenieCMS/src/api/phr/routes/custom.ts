export default {
  routes: [
    {
      method: "GET",
      path: "/phr/pdf/:id",
      handler: "custom.getPdf",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/phr/pdf/:id/generate",
      handler: "custom.generatePdf",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
