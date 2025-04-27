// var strapi = require("strapi");

// strapi()
//   .load()
//   .then(async (strapiInstance) => {
//     let data = await strapiInstance
//       .query("permission", "users-permissions")
//       .find();
//     // do something
//     console.log(data);
//     // exit with 0 code
//     strapiInstance.stop(0);
//   });

const path = require("path");
require(path.join(__dirname, process.argv[2]));
