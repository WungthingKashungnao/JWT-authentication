const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json()); //so that the express server can understand or handle json files
require("dotenv").config();

let refreshTokens = [];
// routes start
// generate new token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) {
    return res.sendStatus(401); //if there is no token
  }
  if (!refreshToken.includes(refreshToken)) {
    return res.sendStatus(403); //if the token does not exists
  }

  // verify token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name }); //extracting only name from the token
    res.json({ accessToken: accessToken });
  });
});

// logout or delete token
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

// login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // require('crypto').randomBytes(64).toString('hex') => use this to generate secret key using node terminal

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken); //pushing new refresh token into the array
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// function to generate access token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}
// routes end

app.listen(4000, () => {
  console.log("server has started running on port 4000");
});
