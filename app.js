const express = require("express");
const app = express();
const cors = require("cors");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const path = require("node:path");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");

const indexRouter = require("./routes/indexRouter");
const postRouter = require("./routes/postRouter");
const db = require("./db/queries");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
// opts.passReqToCallback = true;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("in JWT strategy");
    console.log(jwt_payload);

    // User.findOne({ id: jwt_payload.sub }, function (err, user) {
    try {
      const user = await db.checkUserExists(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("im in the localstrategy function");
    try {
      const user = await db.checkUserExists(username);
      // const user = rows[0];
      console.log(`user:`);
      console.log(user);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      console.log(`match:`);
      console.log(match);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.options("*", cors());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/posts", postRouter);
// app.use("/posts/:postId/comments", commentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Blog API app - listening on port ${PORT}!`);
});
