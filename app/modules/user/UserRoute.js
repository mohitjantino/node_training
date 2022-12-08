const { Router } = require("express");
const {
  findUser,
  findUsers,
  insertUser,
  updateUser,
  deleteUser,
  login,
} = require("./UserController");
const { tokenChecker } = require("../../comman/middleware");

const Route = Router();

//get all user
Route.get("/all", findUsers);
//insert user
Route.post("/insert", insertUser);
//find user
Route.get("/", tokenChecker, findUser);
//update user
Route.put("/update/", tokenChecker, updateUser);
//delete user
Route.delete("/delete/:id", deleteUser);

//login user
Route.post("/login", login);

module.exports = Route;
