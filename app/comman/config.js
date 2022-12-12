require("dotenv").config();
const DBURL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const SALT_WORK_FACTOR = +process.env.SALT_WORK_FACTOR;
const JWT_STRING = process.env.JWT_STRING;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
module.exports = {
  DBURL,
  PORT,
  SALT_WORK_FACTOR,
  JWT_STRING,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
};
