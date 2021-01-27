let express = require('express')
// const { in } = require('sequelize/types/lib/operators')
let router = express.Router()
let db = require('../models')
const passport = require('../config/ppConfig.js')
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')
const isLoggedIn = require('../middleware/isLoggedIn')

router.get('/signup', (req, res) =>{
  res.render('auth/signUp.ejs')
})

router.post('/signup', (req, res) =>{
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults:{
      name_first: req.body.name_first,
      name_last: req.body.name_last,
      gender: req.body.gender,
      language: req.body.language,
      password: req.body.password
    }
  })
  .then(([user, wasCreated]) =>{
    if(wasCreated){
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and user logged in',
      })(req, res)
      // res.send(`Created a new user profile for ${user.email}`)
    } else {
      req.flash('error', `Account alreaedy exists! Try logging in.`)
      res.redirect('/auth/login')
    }
  })
  .catch(err => {
    req.flash('error', err.message)
    res.redirect('/auth/signUp')
  })
})

router.get('/login', (req, res) =>{
  res.render('auth/logIn.ejs')
})

// router.post('/login', (req, res) =>{
//   db.user.findOne({
//     where: {
//       email: req.body.email,
//       password: req.body.password
//     }
//   })
//   .then(foundUser =>{
//     res.send(`Logged in the following user: ${foundUser.name}`)
//   })
//   .catch(err=>{
//     console.log(err)
//     res.send('There was an error logging in. Check the console?')
//   })
// })

router.get('/update', isLoggedIn, (req, res) =>{
  res.render('auth/update.ejs')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  successRedirect: '/',
  successFlash: "You are now logged in.",
  failureFlash: 'Invalid email or password.'
}))

router.get('/logout', (req, res) =>{
  req.logOut()
  res.redirect('/')
  // res.send('You are now logged out. Have a nice day!')
})

module.exports = router