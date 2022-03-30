// Const
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 5000

const origin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_LOCAL_URL;

// App
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
app.use(cors({
    origin: origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))


// Create session
app.use(session({
   key: "userId",
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
       expires: 60 * 60 * 24
   }
}))


// Default Route
app.use("/", require('./routes/controllers'))


// Start Server
app.listen(PORT, () => {
    console.log('server started on port 5000')
})

