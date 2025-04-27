export default {
  async beforeUpdate(event: any) {
    // Store the current state of the entity before it gets updated

    const { params } = event;
    const id = params?.data?.id ?? params?.where?.id;
    if (id) {
      const prevData = await strapi.entityService.findOne(
        "api::subscription-tracker.subscription-tracker",
        id,
        {
          populate: {
            subscribedBy: { fields: ["id"] },
            belongsTo: { populate: { profileImg: { fields: ["url"] } } },
            product: { fields: ["name"] },
          },
        }
      );

      //@ts-ignore
      this.oldData = prevData;
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;

    //@ts-ignore
    createUserNotificationsIfNeeded(this.oldData, result);

    return event;
  },
};

const createUserNotificationsIfNeeded = (prevData, afterData) => {
  try {
    if (!prevData || !afterData) {
      console.log(
        "Could not get data in the afterUpdate lifecycle for service tracker!"
      );
      return;
    }

    if (
      prevData.paymentStatus === "due" &&
      afterData.paymentStatus === "expired"
    ) {
      console.log(
        `Payment window for subscription booking expired ${prevData.product.name} `
      );

      strapi.entityService.create("api::user-notification.user-notification", {
        data: {
          title: `Subscription booking expired`,
          message: `Payment window expired for your subscription booking ${prevData.product.name}.`,
          type: "app",
          read: false,
          actionType: "openPage",
          actionUrl: `/bookingDetailsScreen/${prevData.id}`,
          user: prevData.subscribedBy.id,
          additionalData: [],
        },
        populate: {
          user: true,
          additionalData: true,
          image: true,
        },
      });
      return;
    }
  } catch (error) {
    console.log(
      "createUserNotificationsIfNeeded lifecycle function failed for service tracker!",
      error
    );
  }
};
