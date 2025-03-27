const { Router } = require("express");
const { body } = require("express-validator");
const indexRouter = Router();
const controller = require("../controllers/indexController");
const passport = require("passport");

// indexRouter.get("/signup", (req, res) => {
//   res.json({ msg: "hey you got something!" });
// });

indexRouter.post(
  "/signup",
  body("confirm", "Passwords do not match").custom((value, { req }) => {
    console.log(value);
    console.log(req.body.password);
    return value === req.body.password;
  }),
  controller.postSignup
  //   (req, res) => {
  //     res.send("ok made it to signup func");
  //   }
);

// indexRouter.post("/logout", controller.logout);

// indexRouter.get("/login", (req, res) => {
//   res.json({ msg: "hey you got something!" });
// });

indexRouter.post(
  "/login/password",
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.postLogin
);

// indexRouter.post("/logout", controller.logout);

//validate is author
indexRouter.get("/isauthor", controller.isAuthor);

module.exports = indexRouter;
