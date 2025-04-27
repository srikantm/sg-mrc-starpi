export default {
  async afterCreate(event: any) {
    const { result } = event;

    if (result) {
      sentNotification(result);
    }
    return event;
  },
};

const sentNotification = async (notificationData: any) => {
  try {
    if (!notificationData) {
      console.log("Error getting notification data in lifecycle hook");
      return;
    }

    if (notificationData.type !== "app") {
      return;
    }

    const fcm = notificationData.user.fcm;

    if (!fcm) {
      console.log("fcm does not exist, skipping push notification!");
      return;
    }

    const payload =
      (notificationData.additionalData?.length ?? 0) > 0
        ? notificationData.additionalData.reduce((obj, item) => {
            obj[item.key] = item.value;
            return obj;
          }, {})
        : {};
    const data = {
      data: {
        actionType: notificationData.actionType,
        actionUrl: notificationData.actionUrl ?? "/",
        ...payload,
      },
      notification: {
        title: notificationData.title,
        body: notificationData.message,
        imageUrl: notificationData.image
          ? notificationData.image.url
          : undefined,
      },
    };

    console.log("push notification data", data);
    // @ts-ignore
    strapi.notification.sendNotification(fcm, data);
  } catch (e) {
    console.log("push notification failed!", e);
  }
};
