export default {
  async beforeUpdate(event: any) {
    // Store the current state of the entity before it gets updated

    const { params } = event;
    const id = params?.data?.id ?? params?.where?.id;
    if (id) {
      const prevData = await strapi.entityService.findOne(
        "api::service-tracker.service-tracker",
        id,
        {
          populate: {
            requestedBy: { fields: ["id"] },
            // requestedFor: { populate: { profileImg: { fields: ["url"] } } },
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
      prevData.status === afterData.status &&
      prevData.paymentStatus === afterData.paymentStatus
    ) {
      return;
    }
    if (
      prevData.status === "requested" &&
      prevData.paymentStatus === "due" &&
      afterData.status === "processing" &&
      afterData.paymentStatus === "paid"
    ) {
      console.log(`Successfully booked the service ${prevData.product.name} `);

      strapi.entityService.create("api::user-notification.user-notification", {
        data: {
          title: `${prevData.product.name} booked`,
          message: `Your request for the service ${prevData.product.name} has been successfully recieved`,
          type: "app",
          read: false,
          actionType: "openPage",
          actionUrl: `/bookingServiceStatusDetailsPage/${prevData.id}`,
          user: prevData.requestedBy.id,
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

    if (
      prevData.status === "requested" &&
      prevData.paymentStatus === "due" &&
      afterData.status === "requested" &&
      afterData.paymentStatus === "expired"
    ) {
      console.log(
        `Payment window for service booking expired ${prevData.product.name} `
      );

      strapi.entityService.create("api::user-notification.user-notification", {
        data: {
          title: `${prevData.product.name} service booking expired`,
          message: `Payment window expired for the service ${prevData.product.name}.`,
          type: "app",
          read: false,
          actionType: "openPage",
          actionUrl: `/bookingServiceStatusDetailsPage/${prevData.id}`,
          user: prevData.requestedBy.id,
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

    if (prevData.status !== "completed" && afterData.status === "completed") {
      console.log(
        `Successfully completed the service ${prevData.product.name} `
      );
      strapi.entityService.create("api::user-notification.user-notification", {
        data: {
          title: `${prevData.product.name} completed`,
          message: `Congratulations on completion of the service ${prevData.product.name}.`,
          type: "app",
          read: false,
          actionType: "openPage",
          actionUrl: `/bookingServiceStatusDetailsPage/${prevData.id}`,
          user: prevData.requestedBy.id,
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
