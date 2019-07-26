const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('./keys')


// =========== Load User Model ==========
const User = mongoose.model('users')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken)
        //console.log(profile)

        const newUser = {
            googleID: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
        }

        //========= Check For Existing User ===========
        User.findOne({
            googleID: profile.id
        }).then(user => {
            if(user){
                // Return User
                done(null, user)
            }else{
                // Create User
                new User(newUser).save()
                .then(user => done(null, user))
            }
        })

    })
   )
   passport.serializeUser((user, done) => {
       done(null, user.id)
   })

   passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user))
    })
}