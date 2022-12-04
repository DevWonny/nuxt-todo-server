require("dotenv").config();
const express = require("express");
// mongoose
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRouter");
const { authentication } = require("./middleware/authentication");

const { PORT, MONGO_URI } = process.env;

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connect!");

    app.use(express.json());
    //authentication
    app.use(authentication);
    app.use("/user", userRouter);

    app.listen(PORT, () => {
      console.log("Express Server Listening on Port" + PORT);
    });
  })
  .catch((err) => console.log(err));
