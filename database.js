var mysql = require('mysql')

var db = mysql.createPool({
    user: process.env.user,
    host: process.env.host,
    password: process.env.password,
    database: process.env.database
})


module.exports = { db }