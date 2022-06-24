const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/sequelize.index");
const User = db.user;
const Role = db.role;
verifyToken = (req, res, next) => {
  let token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  var token = req.headers.cookie;
  var test = jwt.verify(token.replace("access_token=", ""), process.env.JWT_SECRET);
  User.findOne({
    where: {
      username: test.username
    }}).then((user) => {
    Role.findOne({
      where: {
        id: user.role_id,
      },
    }).then((role) => {
      if (role.name === "admin") {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};
isModerator = (req, res, next) => {
  var token = req.headers.cookie;
  var test = jwt.verify(token.replace("access_token=", ""), process.env.JWT_SECRET);
  User.findOne({
    where: {
      username: test.username
    }
  }).then((user) => {
    Role.findOne({
      where: {
        id: user.role_id,
      },
    }).then((role) => {
      if (role.name === "moderator" || role.name === "admin") {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Moderator Role!",
      });
    });
  });
};
isModeratorOrAdmin = (req, res, next) => {
  var token = req.headers.cookie;
  var test = jwt.verify(token.replace("access_token=", ""), process.env.JWT_SECRET);
  User.findOne({
    where: {
      username: test.username
    }
  }).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Moderator or Admin Role!",
      });
    });
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};
module.exports = authJwt;
