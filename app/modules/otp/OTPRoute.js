const express = require("express");
const { tokenChecker } = require("../../comman/middleware/index");
const { sentSms, verifyOtp } = require("./OtpController");

const OTPRoutes = express.Router();

OTPRoutes.post("/generateotp", tokenChecker, sentSms);
OTPRoutes.post("/verifyotp", tokenChecker, verifyOtp);

module.exports = OTPRoutes;
