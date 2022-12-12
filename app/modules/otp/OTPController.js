const UserModel = require("../../modules/user/UserModel");
const OTPModel = require("../../modules/otp/OTPModel");
const bcrypt = require("bcrypt");
//twilio modules
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = require("../../comman/config");
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports.sentSms = async (req, res, next) => {
  const { email } = req;
  try {
    const userNumber = await UserModel.findOne(
      { email },
      { phoneNo: 1, countryCode: 1, name: 1, _id: 1 }
    );
    if (!userNumber) {
      return res.status(403).json({ msg: "no user found" });
    }
    // userNumber:{phoneNo:1,countryCode:1}
    const { name, phoneNo, countryCode, _id } = userNumber;
    const number = countryCode.concat(phoneNo);
    //check if any previous otp data is store or not
    // checkOTPExpiry(_id,expiryTimeInSeconds)
    const optData = await OTPModel.findOne({ userid: _id });
    if (optData) {
      const { createdAt } = optData;
      const differenceInSeconds = Math.ceil(
        (new Date().getTime() - createdAt.getTime()) / 1000
      );
      console.log(differenceInSeconds);
      if (differenceInSeconds > 60) {
        console.log("expire");
        const deleteExpire = await OTPModel.findOneAndDelete({ userid: _id });
        console.log(deleteExpire);
        return res.status(403).json({
          msg: "expired opt deleted successfully",
        });
      }
      return res.status(403).json({
        msg: "Otp already exists",
      });
    }
    const otp = Math.round(1000 + Math.random() * 9000);
    const sentSms = await client.messages.create({
      body: `Hello ${name}! your otp is ${otp}`,
      from: "+12075699256",
      to: number,
    });
    const savedSmsToDB = new OTPModel({ userId: _id, otp });
    const savedOtp = await savedSmsToDB.save();
    return res.status(200).json({
      msg: "success",
      sentSms,
      savedOtp,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  const { email } = req;
  const { userOtp } = req.body;
  try {
    const userNumber = await UserModel.findOne({ email }, { _id: 1 });
    const { _id } = userNumber;
    console.log(_id);
    if (!_id) {
      return res.status(403).json({ msg: "no user found" });
    }
    //check if any previous otp data is store or not
    // checkOTPExpiry(_id,expiryTimeInSeconds)

    const optData = await OTPModel.findOne({ userid: _id });

    if (optData) {
      const { createdAt, otp } = optData;
      const differenceInSeconds = Math.ceil(
        (new Date().getTime() - createdAt.getTime()) / 1000
      );
      if (differenceInSeconds > 60) {
        await OTPModel.findOneAndDelete({ userid: _id });
        return res.status(403).json({
          msg: "expired otp deleted successfully",
        });
      }
      // unhash otp
      const comparePass = await bcrypt.compare(userOtp, otp);
      if (!comparePass) {
        return res.status(400).json({
          msg: "in-valid otp",
        });
      }
      return res.status(200).json({
        msg: "OTP verify successfully",
      });
    }
    return res.status(403).json({
      msg: "OTP expired",
    });
  } catch (err) {
    next(err);
  }
};
