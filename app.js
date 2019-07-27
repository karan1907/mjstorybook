const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()

// ========= Body-parser Middleware =======
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ========= load  Models ==========
require('./models/User')
require('./models/Story')

// ========= Method Override Middleware ========
app.use(methodOverride('_method'))

// ========= Handlebars Helpers =========
const {truncate, stripTags, formatDate, select, editIcon} = require('./helpers/hbs')


// ========= Handlebars Middleware ======

app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
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

// ======== Set Static Folder ==========
app.use(express.static(path.join(__dirname, 'public')))

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
const stories = require('./routes/stories')


// ========== Use Routes =============

app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)

app.listen(port, () => console.log(`Server is running at port ${port}`))