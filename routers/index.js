const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todo = require('./modules/todo')

router.use('/todos', todo)
router.use('/users', users)
router.use('/', home)

module.exports = router
