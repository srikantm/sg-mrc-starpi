import cronTasks from "./cron-tasks";

export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1338),
  cron: {
    enabled: process.env.CRON_ENABLED ? true : false,
    tasks: cronTasks,
  },
  app: {
    keys: env.array("APP_KEYS", ["key1", "key2", "key3", "key4"]),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
