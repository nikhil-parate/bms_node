const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const authRoute = require("./routes/auth.routes");
const cors = require("cors");
const mongo = require("./mongo");
async function loadApp() {
  try {
    await mongo.connect();

    app.use(express.json());
    app.use(cors());

     app.use("/", authRoute);

    //  app.use((req, res, next) => {
    //    const token = req.headers["access-token"];
    //    if (token) {
    //      try {
    //        jwt.verify(token, process.env.TOKEN_PASS);
    // //       next();
    //       console.log("worked");
    //     } catch (err) {
    //       console.log(err);
    //       res.status(403).send({ error: "token validation failed" });
    //     }
    //   } else {
    //     res.status(403).send({ error: "token is missing" });
    //   }
    // });

    app.listen(process.env.PORT, () => console.log("server is starting"));
  } catch (err) {
    console.log(err);

    process.exit();
  }
}
loadApp();
