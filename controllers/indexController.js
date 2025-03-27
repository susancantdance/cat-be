const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// async function getSignup(req, res) {
//   res.render("index");
// }

async function postSignup(req, res, next) {
  console.log("in postSignup function");
  console.log(req.body.password);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(errors.array()[0].msg);
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let user = await db.signup(req.body.username, hashedPassword);
    console.log(user);
    res.json({ msg: `you've signed up ${user.email}` });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function postLogin(req, res, next) {
  console.log("in the postLogin func");
  console.log(req.user);
  jwt.sign({ id: req.user.email }, process.env.SECRET, (err, token) => {
    res.json({
      token,
      id: req.user.email,
      isauthor: req.user.isauthor,
      userid: req.user.id,
    });
  });
}

// async function logout(req, res, next) {
//   console.log("in logout function");
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.json({ msg: "logout successful" });
//   });
// }

//is an author
async function isAuthor(req, res, next) {
  console.log(`userid ${req.body.userid}`);
  const user = await db.isAuthor(+req.body.userid);
  console.log(`author is ${user}`);
  res.json(user.isauthor);
}

module.exports = {
  //   getSignup,
  postSignup,
  postLogin,
  isAuthor,
  // logout,
  //   getLogin,
};
