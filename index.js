const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const dotenv = require("dotenv/config");
// const path = require("path");
// dotenv.config({
//   path: path.resolve(process.env.NODE_ENV + ".env")
// });
const mongoClient = new MongoClient("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoClient.connect(async (err, client) => {
  if (err) return console.log(err);
  console.log(process.env.DB);
  const db = client.db(process.env.DB);
  console.log(process.env.COLLECTION);
  const collection = db.collection(process.env.COLLECTION);

  collection
    .find(
      {},
      {
        projection: {
          _id: 0,
          "headers.browser.name": 1,
          "headers.os.name": 1,
          "screen.height": 1,
          "screen.width": 1,
          "webglparams.webgl2.EXTENSIONS.WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL": 1,
          "webglparams.webgl2.EXTENSIONS.WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL": 1,
        },
      },
    )
    .toArray(function (err, results) {
      fs.writeFile(
        "./preProfiles.json",
        JSON.stringify(results),
        { flag: "a+" },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
        },
      );
      client.close();
    });
});
