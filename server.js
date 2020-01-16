const express = require('express');
const session = require('express-session');

const server = express();

const UserRouter = require("./users/user-route");

server.use(express.json());

server.use("/api/users", UserRouter);

module.exports = server;