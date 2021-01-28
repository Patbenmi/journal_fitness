let axios = require('axios')
let express = require('express')
let app = express()
let ejsLayouts = require('express-ejs-layouts')
require('dotenv').config()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')
const methodOverride = require('method-override')

//set the view engine to ejs
app.set('view engine', 'ejs')
//tells the app to use ejs layouts
app.use(ejsLayouts)
//body parser middleware allows us to receive form data in req.body
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
//passport middleware
app.use(passport.initialize())
app.use(passport.session())
// flash middleware
app.use(flash())
//custom middleware
app.use((req, res, next) =>{
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next() // move on the next piece of middleware
})

// controller middleware
app.use('/auth', require('./controllers/auth'))
app.use('/exercise', require('./controllers/exercise'))
app.use('/workout', require('./controllers/workout'))

app.get('/', (req, res) =>{
  // if(req.user){
  //   res.render(`req.user: ${req.user.name}`)
  // } else {
  //   res.send('No user is currently logged in')
  // }
  res.render('home')
})

app.get('/profile', isLoggedIn, (req, res) =>{
  res.render('profile')
})
app.get('*', (req, res) =>{
  res.render('404.ejs')
})

app.listen(process.env.PORT,() =>{
  console.log(`Here comes the sun! Do-Do-Do-ooOOoo! (on port ${process.env.PORT})`)
})