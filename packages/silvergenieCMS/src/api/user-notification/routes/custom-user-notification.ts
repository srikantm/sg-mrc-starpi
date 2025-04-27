export default {
  routes: [
    {
      method: "POST",
      path: "/user-notifications/:id/mark-as-read",
      handler: "user-notification.markAsRead",
    },
  ],
};
