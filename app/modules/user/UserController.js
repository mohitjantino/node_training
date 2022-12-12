const UserModel = require("./UserModel");
const jwt = require("jsonwebtoken");
const { JWT_STRING } = require("../../comman/config");
const bcrypt = require("bcrypt");

//twilio modules
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = require("../../comman/config");
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports.insertUser = async (req, res, next) => {
  const { email, name, phoneNo, countryCode, password } = req.body;
  if (!email || !name || !phoneNo || !countryCode || !password) {
    return res.status(400).json({
      msg: "Enter Valid Fields",
    });
  }
  try {
    //checking phone no uniqueness
    const findNoWithCountryCode = await UserModel.find(
      { countryCode },
      { phoneNo: 1, _id: 0 }
    );
    //[{phoneNo:122122},{phoneNo:122122}]
    const findNo = findNoWithCountryCode.find(
      (phoneNumber) => phoneNumber.phoneNo === phoneNo
    );
    if (findNo) {
      return res.status(403).json({
        msg: `number exist already with countryCode ${countryCode}`,
      });
    }
    const findEmail = await UserModel.findOne({ email });
    if (findEmail) {
      return res.status(403).json({
        msg: "Email already exist",
      });
    }
    const newUser = new UserModel({
      email,
      name,
      phoneNo,
      countryCode,
      password,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      //implementing jwt token
      const generatedToken = await jwt.sign(
        { email: savedUser.email },
        JWT_STRING,
        {
          expiresIn: "1800s",
        }
      );
      return res.status(200).json({ savedUser, generatedToken });
    }
  } catch (err) {
    next(err);
  }
};
module.exports.findUsers = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find({}, { password: 0 });
    return res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
};
module.exports.findUser = async (req, res, next) => {
  try {
    const { email } = req;
    const findbyid = await UserModel.findOne({ email }, { password: 0 });
    if (findbyid) {
      return res.status(200).json(findbyid);
    }
    return res.status(400).json({
      err: "No user found",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateUser = async (req, res, next) => {
  const { name, phoneNo, countryCode } = req.body;
  if (!name || !phoneNo || !countryCode) {
    return res.status(403).json({
      msg: "Enter Valid Fields",
    });
  }
  try {
    ///check if phone no already exist or not also check if CC+phone no are unique
    //checking phone no uniqueness
    const findNoWithCountryCode = await UserModel.find(
      { countryCode },
      { phoneNo: 1, _id: 0 }
    );
    //[{phoneNo:122122},{phoneNo:122122}]
    const findNo = findNoWithCountryCode.find(
      (phoneNumber) => phoneNumber.phoneNo === phoneNo
    );
    if (findNo) {
      return res.status(403).json({
        msg: `number exist already with countryCode ${countryCode}`,
      });
    }
    //////

    const { email } = req;
    const findbyidandupdate = await UserModel.findOneAndUpdate(
      { email },
      { name, phoneNo },
      { new: true }
    );
    if (findbyidandupdate) {
      return res.status(200).json(findbyidandupdate);
    }
    return res.status(403).json({
      err: "No user found",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const findbyidandremove = await UserModel.findByIdAndRemove({ _id: id });
    if (findbyidandremove) {
      return res.status(200).json(findbyidandremove);
    }
    return res.status(400).json({
      err: "No user found",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      msg: "Enter Valid Fields",
    });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        msg: "Please Provide valid Email",
      });
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(400).json({
        msg: "in-valid Password",
      });
    }
    const generatedTokken = jwt.sign({ email: email }, JWT_STRING, {
      expiresIn: "4000s",
    });
    return res.status(200).json({ user, token: generatedTokken });
  } catch (err) {
    next(err);
  }
};
module.exports.sentSms = async (req, res, next) => {
  const { email } = req;
  try {
    const userNumber = await UserModel.findOne(
      { email },
      { phoneNo: 1, countryCode: 1, name: 1, _id: 0 }
    );
    if (!userNumber) {
      return res.status(403).json({ msg: "no user found" });
    }
    // userNumber:{phoneNo:1,countryCode:1}
    const { name, phoneNo, countryCode } = userNumber;
    const number = countryCode.concat(phoneNo);
    console.log(number);
    const sentSms = await client.messages.create({
      body: `Hello ${name}! your otp is ${Math.round(
        1000 + Math.random() * 9000
      )}`,
      from: "+12075699256",
      to: number,
    });
    return res.status(200).json({
      msg: "success",
      sentSms,
    });
  } catch (err) {
    next(err);
  }
};
