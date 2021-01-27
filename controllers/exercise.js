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
    }, 
    // include: [db.comment]
  }).then(user => {
    user.getExercises().then(exercises =>{
      // console.log(exercises)
      console.log("Pumpkin Pie", exercises)
      res.render('./exercise/favorite', {exercises, user})
    })
  })
  .catch(error => console.log(error))
})

router.delete('/favorite', isLoggedIn, (req, res) =>{
  db.user.findOne({
    where: {
      id: req.user.id
    }
  }).then(user =>{
    user.getExercises().then(exercises => {
      let exerciseData = JSON.parse(exercises)
      exerciseData.splice(req.params.apiId, 1)
      exercises.writeFileSync(models.exercise)
    })
  })
})

router.get('/:id', isLoggedIn, (req, res) =>{
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
  }).then(() =>{
    db.comment.findAll({
      where: {
        exerciseId: req.params.id
      }
    })
  })
  .then(comment => {
    // console.log('Look Here!', apiResponse.data)
    // console.log(apiResponse.data)
    res.render('exercise/search.ejs', {exercise: exerciseData, comment: comment})
  })
  .catch(error => console.log(error))
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

router.post('/:id/comment', isLoggedIn, (req, res) => {
  db.comment.create(req.body).then((comments) =>{
    console.log()
    res.redirect('/exercise/'+ req.body.exerciseId)
  })
  .catch(error => console.log(error))
})

router.put('/:id/comment', isLoggedIn, (req, res) => {
  db.comment.update({
    where: {
      id: req.body.id
    },
    defaults: {
      userId: req.body.currentUser.id,
      exerciseId: req.body.exercise.id
    }
    .then((userComments) =>{
      userComments(req.params.id).comment = req.body.comment
      res.redirect('/exercise/'+req.body.exerciseId)
    })
    .catch(error => console.log(error))
  })
})
// router.delete('/:id/comment/?_method=DELETE', isLoggedIn, (req, res))

module.exports = router