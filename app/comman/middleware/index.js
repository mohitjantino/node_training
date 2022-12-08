const jwt = require("jsonwebtoken");
const { JWT_STRING } = require("../config");
module.exports.errorMiddleware = (req, res, err) => {
  return res.status(500).json({
    msg: err.message,
  });
};

module.exports.tokenChecker = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    res.status(401).json({ msg: "no tokken find" });
  }
  const decode = jwt.verify(token, JWT_STRING);
  req.email = decode["email"];
  next();
};
