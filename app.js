const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const exphbs = require('express-handlebars')

const app = express()

// ========= load User Model ==========
require('./models/User')

// ========= Handlebars Middleware ======

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')


//========== Cookie and express-session ========
app.use(cookieParser())
app.use(session({
    secret: 'Goldy King',
    resave: false,
    saveUninitialized: false
  }))

//======== Passport Config ========
require('./config/passport')(passport)

// ======= Passport Middleware ======

app.use(passport.initialize())
app.use(passport.session())

// ========= Set Global Variable ========

app.use((req,res,next) => {
    res.locals.user = req.user || null
    next()
})

// =========== Mongoose Connect =====
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB Connected')
}).catch((error) => {
    console.log(error)
})




const port = process.env.PORT || 3000


// =========== Load Routes ===========
const index = require('./routes/index')
const auth = require('./routes/auth')



// ========== Use Routes =============

app.use('/', index)
app.use('/auth', auth)


app.listen(port, () => console.log(`Server is running at port ${port}`))