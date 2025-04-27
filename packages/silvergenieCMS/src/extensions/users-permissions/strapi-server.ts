import { responseService } from "../../utils";

export = (plugin) => {
  const update = plugin.controllers.user.update;
  plugin.controllers.user.update = async (ctx) => {
    const authUser = ctx.state.user;
    const { id } = ctx.params;
    // todo: Update this to change it to update for self and family members
    if (id != authUser.id) {
      return new responseService(ctx).BAD_REQUEST;
    }
    const nonUpdateableKeys = ["email", "username", "password", "phoneNumber"];
    if (nonUpdateableKeys.some((i) => i in ctx.request.body)) {
      return new responseService(ctx).BAD_REQUEST;
    }

    return update(ctx);
  };

  /**
    Appends a function that saves the messaging token from a client device to the plugin's controller
    **/
  plugin.controllers.auth.saveFCM = async (ctx) => {
    var res = await strapi.entityService.update(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { data: { fcm: ctx.request.body?.token ?? null } }
    );
    ctx.body = res;
  };
  /**
      Adds a POST method route that is handled by the saveFCM function above.
      **/
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/local/fcm",
    handler: "auth.saveFCM",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
