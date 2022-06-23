const db = require("../models/sequelize.index");
// const ROLES = db.ROLE;
const User = db.user;
const Role = db.role

checkDuplicateUsernameOrEmail = (req, res, next) => {
  //Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Username is already in use!",
      });
      return;
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Email is already in use!",
        });
        return;
      }
      next();
    });
  });
};

checkPasswordLength = (req, res, next) => {
  var password = req.body.password
  if(password.length < 6){
    res.status(400).send({
      message: "Your password must be atleast 6 characters long."
    })
    return
  }
  next();
}

// checkRolesExisted = (req, res, next) => {
//   Role.findOne({
//     where: {
//       name: req.body.role,
//     },
//   }).then((role) => {
//     if(!role){
//       res.status(404).send({
//         message: "No such role!"
//       });
//       return
//     }
//     next();
//   })
// };

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    // checkRolesExisted: checkRolesExisted
    checkPasswordLength: checkPasswordLength
  };
  module.exports = verifySignUp;
