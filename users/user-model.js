const db = require("../data/dbConfig")

const getUsers = () => {
    return db("users")
}

const findByDepartment = department => {
    return db("users").where({department})
}

const findByID = id => {
    return db("users").where({id});
}

const findBy = username => {
    return db("users").where({username})
}

const registerUser = user => {
    return db("users").insert(user);
}

module.exports = {
    getUsers,
    findByID,
    findBy,
    findByDepartment,
    registerUser
}