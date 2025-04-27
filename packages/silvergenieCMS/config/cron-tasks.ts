import {
  handleObsoluteServiceTrackers,
  handleSubcriptionTrackerStatus,
  handleObsoluteSubcriptionTrackers,
} from "../src/utils";

export default {
  // restoreUser: {
  //   task: async ({ strapi }) => {
  //     /* Add your own logic here */
  //     const k = await strapi.service("api::utils.oldsync");
  //     // console.log();
  //     try {
  //       k.restoreUser();
  //     } catch (error) {}
  //   },
  //   // only run once after 1 seconds
  //   options: {
  //     rule: "*/3 * * * * *",
  //     // start 10 seconds from now
  //     // start: new Date(Date.now() + 10000),
  //     // end 20 seconds from now
  //     // end: new Date(Date.now() + 20000),
  //   },
  // },

  handleObsoluteServiceAndSubscriptions: {
    /// Handling subscriptions and services, updating the status if payment is never made

    task: async ({ strapi }) => {
      await handleObsoluteSubcriptionTrackers(strapi).catch();
      await handleObsoluteServiceTrackers(strapi).catch();
    },
    options: {
      rule: "*/30 * * * *",
    },
  },

  handleSubscriptionExpiry: {
    /// Updating the expired subscription's status conditionally

    task: async ({ strapi }) => {
      await handleSubcriptionTrackerStatus(strapi).catch();
    },
    options: {
      rule: "0 0 * * *",
    },
  },
};
