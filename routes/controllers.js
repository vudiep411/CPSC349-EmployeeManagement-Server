const express = require('express')
var { db } = require('../database')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// Get all employees
// @Getmapping(/employees)
router.get('/employees' , (req, res) => {
    db.query('SELECT * FROM employee_table', (err, result) =>{
        if(err) {
            console.log(err)
        } else {
            res.json(result)
        }
    })
})


// Get one employee
router.get('/employee/:id', (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM employee_table WHERE id = ?', id, (err, result) =>{
        if(err) {
            console.log(err)
        } else {
            res.json(result)
        }
    })
})

// Create new employee
router.post("/create", (req, res) => {
    const name = req.body.name
    const phone_number = req.body.phone_number
    const supervisors = req.body.supervisors

    db.query('INSERT INTO employee_table(name, phone_number, supervisors) VALUES (?, ?, ?)',
    [name, phone_number, supervisors], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})


// Update an employee
router.put("/update/:id", (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const phone_number = req.body.phone_number
    const supervisors = req.body.supervisors

    db.query('UPDATE employee_table SET name=?, phone_number=?, supervisors=? WHERE id=?',
    [name, phone_number, supervisors, id], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            console.log('success')
        }
    })
})


// Delete an Employee
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id
    db.query("DELETE FROM employee_table WHERE id = ?", id, (err, result) => {
        if(err) {
            console.log(err)
        }
        else{
            console.log('success')
        }
    })
})


// Login
router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query('SELECT * FROM users WHERE username = ?', username, (err, result) => {
        if(err) {
            console.log(err)
        }
        if(result.length > 0)
        {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if(response)
                {
                    req.session.user = result
                    const id = result[0].id
                    const token = jwt.sign({id}, process.env.TOKEN_SECRET, {
                        expiresIn: 300,
                    })
                    res.json({auth: true, token: token, result})
                }
                else
                {
                    res.send({auth: false, message: "Wrong username or password"})
                }
            })
        }
        else {
            res.json({auth: false, message:"User doesn't exist"})
        }
        })
})

// Register
router.get("/checkRegister/:username", (req, res) => {
    const username = req.params.username
    db.query('SELECT * FROM users WHERE username = ?', username, (err, result) => {
        if(err) {
            console.log(err)
        }
        else
        {
            if(result.length > 0)
            {
                res.send({message: "User Already Exist"})
            }
            else{
                res.send({valid: true})
            }
        }
    })
})

router.post("/register", async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const username = req.body.username
        db.query("INSERT into users(username, password) VALUES(?, ?)", 
        [username, hashPassword], (err, result) =>{
            if(err) {
                console.log(err)                
            } else {
                console.log('success')
            }
        })       
    } catch {
        console.log("error")
    }
})


// Check Authenticate
router.get("/isAuth", (req, res) => { 
    const token = req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
    if(!token)
    {
        return res.json({auth: false, message: "Not Authorized"})
    }
    else{
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if(err)
            {
                return res.json({auth: false, message: "Not Authorized"})
            } else{
                const id = decoded.id
                req.userId = id
                return res.json({auth: true, message: "Authorized"})
            }
        })
    }
})

router.get('/logout', (req, res) => {
    res.end()
})


module.exports = router