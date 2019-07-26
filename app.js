const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

//======== Passport Config ========
require('./config/passport')(passport)


const app = express()

const port = process.env.PORT || 3000


// =========== Load Routes ===========
const auth = require('./routes/auth')

app.get('/', (req,res) => {
    res.send('It Works!')
})

// ========== Use Routes =============

app.use('/auth', auth)

app.listen(port, () => console.log(`Server is running at port ${port}`))