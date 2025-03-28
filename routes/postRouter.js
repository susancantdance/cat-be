const { Router } = require("express");
const { body } = require("express-validator");
const postRouter = Router();
const postController = require("../controllers/postController");
const passport = require("passport");

//getposts, single post, comments for a single post
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:postid", postController.getSinglePost);
postRouter.get("/:postid/comments", postController.getAllComments);

//create a post or comment
postRouter.post(
  "/",
  passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  postController.createPost
);
postRouter.post(
  "/:postid/comments",
  passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  postController.createComment
);

//edit a post, publish/unpublish a post, edit comment
postRouter.put(
  "/:postid",
  passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  postController.updatePost
);
postRouter.put(
  "/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  postController.updateComment
);

//delete a post, delete a comment
postRouter.delete(
  "/:postid",
  passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  postController.deletePost
);
postRouter.delete(
  "/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  postController.deleteComment
);

module.exports = postRouter;
