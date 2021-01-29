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
const methodOverride = require('method-override')

router.get('/', isLoggedIn, (req, res) => {
  axios.get(wgerUrl).then(apiResponse => {
    let exercise = apiResponse.data.results
    console.log(apiResponse.data.results)
    res.render('exercise/exercise', { exercise: exercise.slice(0, 408) })
  })
})

router.get('/favorite', isLoggedIn, (req, res) => {
  db.user.findOne({
    where: {
      id: req.user.id
    },
  }).then(user => {
    user.getExercises().then(exercises => {
      res.render('./exercise/favorite', { exercises, user })
    })
  })
  .catch(error => console.log(error))
})

router.delete('/favorite/:id', isLoggedIn, (req, res) => {
  db.user.findByPk(req.user.id, { include: [db.exercise] })
  .then(userInfo => {
    db.exercise.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(exercise =>{
      userInfo.removeExercise(exercise)
      .then(()=>{
        req.flash('error','An exercise has been deleted from your favorites.')
        res.redirect('/exercise/favorite')
      })
    })
  })
  .catch(error => console.log(error))
})

router.get('/:id', isLoggedIn, (req, res) => {
  let exerciseData;
  const currentUrl = `https://wger.de/api/v2/exercise/${req.params.id}?format=json`
  axios.get(currentUrl, {
    withCredentials: true,
    headers: {
      "Authorization": API_KEY,
      'Accept': 'application/json',
      "Content-Type": "application/json"
    }
  }).then(apiResponse => {
    exerciseData = apiResponse.data
  }).then(() => {
    db.comment.findAll({
      where: {
        exerciseId: exerciseData.id,
      }
    }).then(comments => {
      res.render('exercise/search.ejs', { exercise: exerciseData, comment: comments })
    })
    .catch(error => console.log(error))
  })
})

router.post('/:id', isLoggedIn, (req, res) => {
  db.exercise.findOrCreate({
    where: {
      exerciseName: req.body.name,
      exerciseMuscle: req.body.exerciseMuscle,
      exerciseDescription: req.body.exerciseDescription,
      apiId: req.body.apiId,
      exerciseLanguage: req.body.exerciseLanguage
    },
  }).then(([exercise, wasCreated]) => {
    db.user.findOne({
      where: {
        id: req.user.id
      }
    }).then(user => {
      user.addExercise(exercise).then(relationshipinfo => {
        console.log(exercise)
        req.flash('error','An exercise has been added to your favorited exercise page.')
        res.redirect('/exercise/favorite')
      })
    })
  }).catch(error => console.log(error))
})

router.post('/:id/comment', isLoggedIn, (req, res) => {
  db.comment.create(req.body).then((comments) => {
    req.flash('error','Your comment has been posted below.')
    res.redirect('/exercise/' + req.body.exerciseId)
  })
    .catch(error => console.log(error))
})

router.delete('/:id/comment', isLoggedIn, (req, res) => {
  db.comment.destroy({
    where: {
      id: req.body.commentId,
      exerciseId: req.body.exerciseId
    }
  })
    .then(deletedComment => {
      req.flash('error','Your comment has been deleted.')
      res.redirect('/exercise/' + req.body.exerciseId)
    })
    .catch(error => console.log(error))
})


module.exports = router