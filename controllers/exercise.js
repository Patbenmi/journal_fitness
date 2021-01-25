let express = require('express')
// const { in } = require('sequelize/types/lib/operators')
let router = express.Router()
let db = require('../models')
const API_KEY = process.env.API_KEY
const passport = require('../config/ppConfig.js')
const LocalStrategy = require('passport-local')
const { default: axios } = require('axios')
const isLoggedIn = require('../middleware/isLoggedIn.js')
const wgerUrl = "https://wger.de/api/v2/exercise/?language=2>"

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

router.get('/:id', isLoggedIn, (req, res) =>{
  let currentUrl = `https://wger.de/en/exercise/${req.params.id}/view/.${API_KEY}`
  axios.get(currentUrl).then(apiResponse => {
    let exercise = apiResponse.data.results
    console.log(apiResponse.data)
    // console.log(apiResponse.data.results)
    // res.render('exercise/search.ejs', {exercise: exercise})
  }).catch(error => console.log(error))
})

router.post('/:id', isLoggedIn, (req, res) =>{
  db.exercise.findOrCreate({
    where: {
      exerciseName: req.body.name
    },
    defaults:{
      exerciseMuscle: req.body.muscles,
      exerciseDescription: req.body.description,
      exerciseLanguage: req.body.language
    }
  }).then(([exercise, wasCreated]) =>{
    res.render('exercise/favorite', {exercise: exercise})
  }).catch(error => console.log(error))
})

module.exports = router