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

router.get('/favorite', isLoggedIn, (req, res) =>{
  console.log(req.user.id)
  db.user.findOne({
    where: {
      id: req.user.id
    }
  }).then(user => {
    user.getExercises().then(exercises =>{
      res.render('./exercise/favorite', {exercises})
    })
  })
  .catch(error => console.log(error))
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
      exerciseMuscle: req.body.exerciseMuscle,
      exerciseDescription: req.body.exerciseDescription,
      apiId: req.body.apiId,
      exerciseLanguage: req.body.exerciseLanguage
    },
  }).then(([exercise, wasCreated]) =>{
    db.user.findOne({
      where: {
        id: req.user.id
      }
    }).then(user => {
      user.addExercise(exercise).then(relationshipinfo =>{
        console.log(exercise)
        res.redirect('/exercise/favorite')
      })
    })
  }).catch(error => console.log(error))
})

module.exports = router