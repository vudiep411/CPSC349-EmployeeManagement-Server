const mysql = require('mysql')

var db = mysql.createConnection({
    user: process.env.user,
    host: process.env.host,
    password: process.env.password,
    database: process.env.database
})

const handleDisconnect = () =>
{
    db = mysql.createConnection({
        user: process.env.user,
        host: process.env.host,
        password: process.env.password,
        database: process.env.database
    })
    db.connect((err) => {
        if(err)
        {
            console.log('Error when connecting to db:', err)
            setTimeout(handleDisconnect, 2000)          
        }
    })
    db.on('error', (err) => {
        console.log('db error', err)
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
        {
            handleDisconnect();
        }
        else
        {
            throw err;
        }
    })
}
module.exports = { db, handleDisconnect }