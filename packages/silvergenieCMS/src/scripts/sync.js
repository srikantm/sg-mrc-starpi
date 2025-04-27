const fs = require("fs");
const { setupStrapi, cleanupStrapi } = require("./helper");

// beforeAll(async () => {
// });

// afterAll(async () => {
// });
const test = async () => {
  await setupStrapi();
  console.log(strapi);
  await cleanupStrapi();
};

test();
