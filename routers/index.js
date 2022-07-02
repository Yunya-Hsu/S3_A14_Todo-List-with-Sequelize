const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todo = require('./modules/todo')

const { authenticator } = require('../middleware/auth')

router.use('/todos', authenticator, todo)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router
