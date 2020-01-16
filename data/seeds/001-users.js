const bcrypt = require("bcryptjs");

const hash = bcrypt.hashSync('testing', 14);

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {id: 1, username: 'guy', password: hash, department: 'HR'},
        {id: 2, username: 'girl', password: hash, department: 'IT'},
        {id: 3, username: 'it', password: hash, department: 'PR'}
      ]);
    });
};
