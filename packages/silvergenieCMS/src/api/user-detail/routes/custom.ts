export default {
  routes: [
    {
      method: "GET",
      path: "/user/epr/pdf/:id",
      handler: "custom.getPdf",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/epr/pdf/:id/generate",
      handler: "custom.generatePdf",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/login/",
      handler: "custom.loginUser",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/verify-otp/",
      handler: "custom.verifyOtp",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/user/phr",
      handler: "custom.getUserPHR",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/family/phr",
      handler: "custom.getUserPHR",
      config: {
        policies: [],
        middlewares: ["api::family.validate-user-family"],
      },
    },
    {
      method: "GET",
      path: "/user/epr",
      handler: "custom.getUserEPR",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/family/epr",
      handler: "custom.getUserEPR",
      config: {
        policies: [],
        middlewares: ["api::family.validate-user-family"],
      },
    },
    {
      method: "POST",
      path: "/auth/register-app-user",
      handler: "custom.registerAppUser",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/register-complete",
      handler: "custom.verifyRegistrationOtp",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/user/add-family",
      handler: "custom.addFamily",
      config: {
        policies: [],
        middlewares: ["api::user-detail.validate-address"],
      },
    },
    {
      method: "GET",
      path: "/user/family",
      handler: "custom.getFamily",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/family/:id/update",
      handler: "custom.updateFamilyMember",
      config: {
        policies: [],
        middlewares: [
          "api::family.validate-user-family",
          "api::user-detail.validate-address",
        ],
      },
    },
  ],
};
