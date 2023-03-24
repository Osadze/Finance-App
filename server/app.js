require("dotenv").config();
require("express-async-errors");
var bodyParser = require("body-parser");

// Security Packages
const helmet = require("helmet")
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit')

const express = require("express");
const app = express();

// ConnectDB
const connectDB = require("./db/connect");
// Routers
const authRouter = require("./routes/auth");
const financeRouter = require("./routes/finances");

// Middleware
const authenticateUser = require("./middleware/authentication");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit each IP to 100 requests per windowMs
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet())
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/finances", authenticateUser, financeRouter);

// Middleware
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
