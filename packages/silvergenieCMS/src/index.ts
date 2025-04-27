import admin from "firebase-admin";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
          "base64"
        ).toString()
      );

      let firebase = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      //Make Firebase available everywhere
      strapi.firebase = firebase;
      let messaging = firebase.messaging();

      let sendNotification = (fcm, data) => {
        let message = {
          ...data,
          token: fcm,
        };
        messaging
          .send(message)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      // Make the notification functions available everywhere
      strapi.notification = {
        sendNotification,
      };
    }
  },
};
