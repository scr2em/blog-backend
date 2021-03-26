const jwt = require("jsonwebtoken");
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;

//ACCESS_TOKEN

const createAccessToken = (id) => {
  return jwt.sign({ id }, access_token_secret, {
    expiresIn: "10hr",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, access_token_secret);
};
// REFRESH_TOKEN

const createRefreshToken = (id) => {
  return jwt.sign({ id }, refresh_token_secret, {
    expiresIn: "90d",
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, refresh_token_secret);
};
module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
