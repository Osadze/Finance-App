require("dotenv").config();
require("express-async-errors");
var bodyParser = require("body-parser");

const express = require("express");
const app = express();
var cors = require("cors");

// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const financeRouter = require("./routes/finances");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/finances", authenticateUser, financeRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`========= Server is listening on port ${port} =========`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
