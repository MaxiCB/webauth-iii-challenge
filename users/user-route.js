const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets")

const router = express.Router();

const Users = require("./user-model");

const { validateFields, protected, restricted } = require("../middleware/user-middleware");

router.get("/", protected, (req, res) => {
  const { token } = req.body;
  var decoded = jwt.decode(token);

  Users.findByDepartment(decoded.department)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err));
});

router.get("/logout", (req, res) => {
  if(req.session){
    req.session.destroy(err => {
      if(err){
        res.send(err)
      } else {
        res.send("Goodbye!")
      }
    })
  }
})

router.post("/register", validateFields, (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  Users.registerUser(user)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json(err));
});

router.post('/login', restricted, (req, res) => {
  let { username } = req.headers;

  Users.findBy(username)
    .first()
    .then(user => {
        const token = generateToken(user);
 
        res.status(200).json({
          message: `Welcome ${user.username}!, have a token...`,
          token,
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id, 
    username: user.username,
    department: user.department
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;