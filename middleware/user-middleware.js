const Users = require("../users/user-model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets")

function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy(username)
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Creden" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Unexpected error" });
      });
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
}

function validateFields(req, res, next) {
  let { username, password, department } = req.body;
  if (!username || !password || !department) {
    res.status(400).json({ error: "Request needs username, passwords, and department" });
  } else {
    next();
  }
}

function protected(req, res, next) {
  const { token } = req.body;
  if (jwt.verify(token, secrets.jwtSecret)) {
    next();
    
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}

module.exports = {
    restricted,
    validateFields,
    protected
}