const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const secrets = require("../config/secrets")

const router = express.Router();

const Users = require("./user-model");

const { restricted, validateFields, protected } = require("../middleware/user-middleware");

router.get("/", (req, res) => {
  Users.getUsers()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err));
});

router.get("/users", protected, (req, res) => {
  Users.getUsers()
    .then(users => res.status(200).json(users))
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

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  let test = req.headers

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); // new line
 
        // the server needs to return the token to the client
        // this doesn't happen automatically like it happens with cookies
        res.status(200).json({
          message: `Welcome ${user.username}!, have a token...`,
          token, // attach the token as part of the response
          test
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = router;