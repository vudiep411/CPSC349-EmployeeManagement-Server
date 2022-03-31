var mysql = require('mysql')

var db = mysql.createConnection({
    user: process.env.user,
    host: process.env.host,
    password: process.env.password,
    database: process.env.database
})
db.connect()

module.exports = { db }