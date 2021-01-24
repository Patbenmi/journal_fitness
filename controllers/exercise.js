let express = require('express')
// const { in } = require('sequelize/types/lib/operators')
let router = express.Router()
let db = require('../models')
const passport = require('../config/ppConfig.js')
const LocalStrategy = require('passport-local')
const { default: axios } = require('axios')
const isLoggedIn = require('../middleware/isLoggedIn.js')
const wgerUrl = "https://wger.de/api/v2/exercise/?language=2"

// router.get('/exercise', (req, res) =>{
//   res.render('exercise.ejs')
// })
router.get('/', isLoggedIn, (req, res) =>{
  axios.get(wgerUrl).then(apiResponse => {
    let exercise = apiResponse.data.results
    console.log(apiResponse.data.results)
    res.render('exercise/exercise', { exercise: exercise.slice(0, 20)})
  })
})

module.exports = router