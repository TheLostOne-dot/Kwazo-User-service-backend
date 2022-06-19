const db = require("../models/sequelize.index");
const config = require("../config/auth.config");
const amqp = require('amqplib/callback_api');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  Role.findOne({
    where: {
      name: req.body.role,
    },
  }).then((role) => {
    // Save User to Database
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role_id: role.id,
    })
      .then(() => {
        res.send({ message: "User was registered successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ username: user.username }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];
      Role.findOne({
        where: {
          id: user.role_id,
        },
      }).then((role) => {
        authorities.push("ROLE_" + role.name.toUpperCase());
        return res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
          })
          .status(200)
          .send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: authorities,
            message: "Logged in successfully",
          });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signout = (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out!" });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      amqp.connect(process.env.AMQP_URL, function (error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }
          const exchange = "kwazo_exchange";
          const keyP = "user-deleted.post";
          const keyC = "user-deleted.comment";

          channel.assertExchange(exchange, "topic", {
            durable: false,
          });
          channel.publish(exchange, keyP, Buffer.from(user.username));
          console.log(" [x] Sent %s:'%s'", keyP, user.username);
          channel.publish(exchange, keyC, Buffer.from(user.username));
          console.log(" [x] Sent %s:'%s'", keyC, user.username);
        });

        setTimeout(function () {
          connection.close();
          // process.exit(0);
        }, 500);
      });
    })
    .then(() => {
      User.destroy({
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "User was deleted successfully!",
            });
          } else {
            res.send({
              message: `Cannot delete User with id=${id}. Maybe Comment was not found!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not delete User with id=" + id,
          });
        });
    });
};
