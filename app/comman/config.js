require("dotenv").config();
const DBURL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const SALT_WORK_FACTOR = +process.env.SALT_WORK_FACTOR;
const JWT_STRING = process.env.JWT_STRING;
module.exports = { DBURL, PORT, SALT_WORK_FACTOR, JWT_STRING };
