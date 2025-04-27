export default {
  routes: [
    {
      method: "GET",
      path: "/progress-note/pdf/:id",
      handler: "custom.getPdf",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/progress-note/pdf/:id/generate",
      handler: "custom.generatePdf",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
