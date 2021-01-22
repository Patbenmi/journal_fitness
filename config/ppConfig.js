const passport = require('passport')
// const { Model } = require('sequelize/types')
const db = require('../models')
const LocalStrategy = require('passport-local')

// ----------------------------> SERIALIZATION SET UP <----------------------------

//tell passport to serealize the user using
// the id by passing it in to the doneCallback function
passport.serializeUser((user,doneCallback) =>{
  console.log('serializing the user...')
  doneCallback(null, user.id)
})

// tells passport how to deserialize the user now by looking it up in 
// the database based on the ID, which is stored in the session
passport.deserializeUser((id, doneCallback) =>{
  db.user.findByPk(id)
  .then(foundUser =>{
    console.log('deserializing user...')
    doneCallback(null, foundUser)
  })
  .catch(err =>{
    console.log('Error deserializing user')
  })
})

// ----------------------------> STRATEGY SET UP <----------------------------

const findAndLogInUser = (email, password, doneCallback) =>{
  //tell passport how to tell if our user is legit
  db.user.findOne({where:{email: email}}) //go check for a user in the db with that email.
  .then(async foundUser =>{
    let match
    if(foundUser){
      //check that the password is accurate.
      match = await foundUser.validPassword(password)
    }
    if(!foundUser || !match){ //there's something funky about the user
      console.log('password was NOT valid i.e. password is false as hell.')
      return doneCallback(null, false)
    }else{//user was legit
      return doneCallback(null, foundUser)
    }
  })
  .catch(err=>doneCallback(err))
}
/* think of doneCallback as a function that looks like this:
login(error, userToBeLoggedIn) {
  //do stuff
}
we provide 'null' if there's no error, or 'false' if there's no user or 
if the password is invalid(like they did in the passport-local docs)
*/

const fieldsToCheck = {
  usernameField: 'email',
  passwordField: 'password'
}

//creating an instance of Local strategy
// ----> constructor arg 1:
//an object that indicates how we're going to refer to the two fields
// we're checking (for ex. we're using email instread of user name)
// ----->constructor arg 2:
// a callback that is ready to reveive the two fields we're checking
//as well as a doneCallback

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)


// More concise way to form funciton:
// passport.use(strategy)
// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, (email, password, doneCallback) =>{
//   //tell passport how to tell if our user is legit
//   db.user.findOne({where:{email: email}}) //go check for a user in the db with that email.
//   .then(async foundUser =>{
//     if(foundUser){
//       let match
//       //check that the password is accurate.
//       match = await foundUser.validPassword(password)
//     }
//     if(!foundUser || !match){ //there's something funky about the user
//       console.log('password was NOT valid i.e. password is false as hell.')
//       return doneCallback(null, false)
//     }else{//user was legit
//       return doneCallback(null, foundUser)
//     }
//   })
//   .catch(err=>doneCallback(err))
// }))
passport.use(strategy)
module.exports = passport