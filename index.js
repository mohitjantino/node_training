//default packages
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
//custom package
const { DBURL, PORT } = require("./app/comman/config");
const userRoute = require("./app/modules/user/UserRoute");
const { errorMiddleware } = require("./app/comman/middleware");
const otpRoute = require("./app/modules/otp/OTPRoute");
//connecting with mongodb
mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("<-------------------------------------->");
    console.log("|  Connected to Database Successfully  |");
    console.log("<-------------------------------------->");
  })
  .catch((err) => {
    next(err);
  });
// intializing express
const app = express();
//enabling cors for accepting request from localhost:3000
app.use(cors());
//body parser middleware for accepting json format data
app.use(express.json());
//initializing morgan --default
app.use(morgan("common"));
//initializing helmet
app.use(helmet());

app.get("/", (req, res) => {
  res.json({
    message: "Antino Project",
  });
});

//user routes
app.use("/user", userRoute);
// otp routes
app.use("/otp", otpRoute);

//error middleware
app.use(errorMiddleware);

//Listening to port
app.listen(PORT, () => {
  console.log("<-------------------------------------->");
  console.log(`| Successfully Running on Port ${PORT} |`);
  console.log("<-------------------------------------->");
});
