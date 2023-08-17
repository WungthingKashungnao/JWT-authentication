const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json()); //so that the express server can understand or handle json files
require("dotenv").config();

let posts = [
  {
    username: "Abner",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

// routes start
app.get("/", (req, res) => {
  res.send("Home");
});
app.get("/posts", authenticateToken, (req, res) => {
  // returning only the posts the user has access to
  res.json(posts.filter((post) => post.username === req.user.name));
  res.json(posts);
});
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const user = { name: username };

//   // require('crypto').randomBytes(64).toString('hex') => use this to generate secret key using node terminal

//   /*creating jsonwebtoken and in this token the user information will be saved,
//   so we can access any of the end points with this saved user information*/
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//   res.json({ accessToken: accessToken });
// });
// routes end

// middleware function to authenticate user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; //getting authorization header from body
  const token = authHeader && authHeader.split(" ")[1]; //if we have a header then we take token from the header |header format| => BEARER TOKEN
  if (token === null) {
    return res.sendStatus(401); //if we dont have any token
  }

  //   verifying token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); //if token is invalid
    }
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log("server has started running on port 3000");
});
