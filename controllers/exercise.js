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
  console.log(req.user.id)
  db.user.findOne({
    where: {
      id: req.user.id
    },
  }).then(user => {
    user.getExercises().then(exercises => {
      console.log("Pumpkin Pie", exercises)
      res.render('./exercise/favorite', { exercises, user })
    })
  })
    .catch(error => console.log(error))
})

router.delete('/favorite', isLoggedIn, (req, res) => {
  console.log('Blueberry', req.body)
  db.userExercise.destroy({
    where: {
      id: req.body.id
    },
    defaults: {
      userId: req.user.id
    }
  }).then(deletedComment => {
    console.log(deletedComment)
    res.redirect('/exercise/favorite')
    })
  })

router.get('/:id', isLoggedIn, (req, res) => {
  console.log("Blue")
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
    console.log("chicken wing", exerciseData)
    db.comment.findAll({
      where: {
        exerciseId: exerciseData.id, 
      }
  }).then(comments => {
      console.log("green beans", comments)
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
        res.redirect('/exercise/favorite')
      })
    })
  }).catch(error => console.log(error))
})

router.post('/:id/comment', isLoggedIn, (req, res) => {
  db.comment.create(req.body).then((comments) => {
    console.log(comments)
    res.redirect('/exercise/' + req.body.exerciseId)
  })
    .catch(error => console.log(error))
})

router.delete('/:id/comment', isLoggedIn, (req, res) =>{
  console.log(req.body)
  console.log(req.body.commentId)
  db.comment.destroy({
    where: {
      id: req.body.commentId,
      exerciseId: req.body.exerciseId
    }
  })
  .then(deletedComment =>{
    console.log(deletedComment)
    res.redirect('/exercise/'+ req.body.exerciseId)
      msg: 'comment deleted'
  })
  .catch(error => console.log(error))
})


module.exports = router