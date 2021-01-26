let express = require('express')
// const { in } = require('sequelize/types/lib/operators')
let router = express.Router()
let db = require('../models')
const API_KEY = process.env.API_KEY
const passport = require('../config/ppConfig.js')
const LocalStrategy = require('passport-local')
const { default: axios } = require('axios')
const isLoggedIn = require('../middleware/isLoggedIn.js')
const wgerUrl = "https://wger.de/api/v2/exercise/?limit=408"

router.get('/', isLoggedIn, (req, res) =>{
  axios.get(wgerUrl).then(apiResponse => {
    let exercise = apiResponse.data.results
    console.log(apiResponse.data.results)
    res.render('exercise/exercise', { exercise: exercise.slice(0, 408)})
  })
})

router.get('/:id', isLoggedIn, (req, res) =>{
  console.log("Blue")
  const currentUrl = `https://wger.de/api/v2/exercise/${req.params.id}?format=json`
  axios.get(currentUrl, {
    withCredentials: true,
    headers: {
      "Authorization": API_KEY,
      'Accept': 'application/json',
      "Content-Type": "application/json"
    }
  }).then(apiResponse => {
    let exercise = apiResponse.data
    console.log('Look Here!', apiResponse.data)
    // console.log(apiResponse.data.results)
    res.render('exercise/search.ejs', {exercise})
  }).catch(error => console.log(error))
})


router.post('/:id', isLoggedIn, (req, res) =>{
  db.exercise.findOrCreate({
    where: {
      exerciseName: req.body.name,
      exerciseMuscle: req.body.muscles,
      exerciseDescription: req.body.description,
      apiId: req.body.id,
      exerciseLanguage: req.body.language
    },
  }).then(([exercise, wasCreated]) =>{
    console.log(exercise)
    res.render('./exercise/favorite', {exercise})
  }).catch(error => console.log(error))
})

router.get('/favorite', isLoggedIn, (req, res) =>{
  db.exercise.findAll().then(exercise =>{
    res.render('./favorite', {exercise})
  })
})

router.post('/search', isLoggedIn, (req, res) =>{
  db.exercise.findOrCreate({
    where: {
      user_id: currentUser.id
    }
  })
  .then(exercise =>{
    res.render('/favorite', {exercise})
  })
  .catch(error => console.log(error))
})

module.exports = router