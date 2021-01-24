let express = require('express')
// const { in } = require('sequelize/types/lib/operators')
let router = express.Router()
let db = require('../models')
const passport = require('../config/ppConfig.js')
const LocalStrategy = require('passport-local')

module.exports = router