const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3002;
require("dotenv").config();

// Routers Import
const authRouter = require("./routers/authRouter");
const articleRouter = require("./routers/articleRouter");
const searchRouter = require("./routers/searchRouter");
const followRouter = require("./routers/followRouter");
const userRouter = require("./routers/userRouter");

app.use(express.json());
const mongoDbUser = process.env.MONGO_DB_USER;
const mongoDbPassword = process.env.MONGO_DB_PASSWORD;
// const mongoUrl = `mongodb+srv://${mongoDbUser}:${mongoDbPassword}@cluster0.i7ohw.mongodb.net/blogdata?retryWrites=true&w=majority`;
const mongoUrl = `mongodb+srv://test:4XdkYAgz0C6I8L5O@cluster0.i7ohw.mongodb.net/blogdata?retryWrites=true&w=majority`;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port: ${port}`));

    app.use(authRouter);
    app.use(articleRouter);
    app.use(searchRouter);
    app.use(followRouter);
    app.use(userRouter);

    app.get("/", (req, res) => {
      res.end("working");
    });
    app.get("*", (req, res) => {
      res.status(404).end();
    });
  })
  .catch((req, res) => {
    res.status(500).end("error");
    console.log("Failed to connect to our database");
  });
