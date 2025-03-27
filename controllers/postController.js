const db = require("../db/queries");

//get all the posts
async function getAllPosts(req, res, next) {
  const posts = await db.getPosts();
  res.json(posts);
}

//get single post
async function getSinglePost(req, res, next) {
  const post = await db.getSinglePost(+req.params.postid);
  res.json(post);
}

//get all the comments for a given post
async function getAllComments(req, res, next) {
  const comments = await db.getComments(+req.params.postid);
  res.json(comments);
}

//make a new post
async function createPost(req, res, next) {
  console.log("in creatpost");
  const newpost = await db.createPost(
    req.body.title,
    req.body.body,
    +req.body.authorid, //how do we get this?
    req.body.ispublished
  );
  res.json(newpost);
}

//update content of post
async function updatePost(req, res, next) {
  const updated = await db.updatePost(
    +req.params.postid,
    req.body.title,
    req.body.body,
    req.body.ispublished
  );
  res.json(updated);
}

//delete post (cascades to comments)
async function deletePost(req, res, next) {
  const deleted = await db.deletePost(+req.params.postid);
  res.json(deleted);
}

//create a comment on a blog post
async function createComment(req, res, next) {
  console.log("create comment function in queries");
  console.log("req.body.email");
  console.log(req.body.email);
  const id = await db.getUserId(req.body.email);
  console.log("id");
  console.log(id.id);
  const comment = await db.createComment(
    +req.params.postid,
    req.body.text,
    +id.id //this probbaly isn't correct, how do we get userid
  );
  res.json(comment);
}

//update a comment on a blog post
async function updateComment(req, res, next) {
  const comment = await db.updateComment(+req.params.commentid, req.body.text);
  res.json(comment);
}

//delete a comment on blog post
async function deleteComment(req, res, next) {
  const deleted = await db.deleteComment(+req.params.commentid);
  res.json(deleted);
}

module.exports = {
  getAllPosts,
  getAllComments,
  getSinglePost,
  //   isAuthor,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
};
