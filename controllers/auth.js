let express = require('express')
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
        successRedirect: '/profile',
        successFlash: 'Account created and user logged in',
      })(req, res)
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

router.get('/update', isLoggedIn, (req, res) =>{
  res.render('auth/update.ejs')
})

router.put('/update/:id', isLoggedIn, (req, res) =>{
  db.user.findByPk(req.user.id)
  .then(userInfo =>{
    db.user.update({
        name_first: req.body.name_first,
        name_last: req.body.name_last,
        gender: req.body.gender,
        language: req.body.language,
        email: req.body.email
    }, {
      where: {
        id: req.user.id
      }
    })
    .then(updatedInformation =>{
      req.flash('error','Your profile has been updated.')
      res.redirect('/profile')
    })
  })
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  successRedirect: '/profile',
  successFlash: "You are now logged in.",
  failureFlash: 'Invalid email or password.'
}))

router.get('/logout', (req, res) =>{
  req.logOut()
  req.flash('error','You are now logged out. Have a nice day!')
  res.redirect('/')
})

module.exports = router