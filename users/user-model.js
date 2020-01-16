const db = require("../data/dbConfig")
const bcrypt = require("bcryptjs");

const getUsers = () => {
    return db("users")
}

const findBy = username => {
    return db("users").where(username);
}

const registerUser = user => {
    return db("users").insert(user);
}

module.exports = {
    getUsers,
    findBy,
    registerUser
}