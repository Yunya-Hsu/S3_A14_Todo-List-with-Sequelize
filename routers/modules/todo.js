const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const name = req.body.name // 從req.body拿出表單裡的name資料
  const userId = req.user.id
  return Todo.create({
    name,
    UserId: userId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => { return res.render('detail', { todo: todo.toJSON() }) })
    .catch(err => console.log(err))
})

module.exports = router
