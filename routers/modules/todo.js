const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

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

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id) // TODO: check model answer
    .then(todo => { return res.render('edit', { todo: todo.toJSON() }) })
})

router.put('/:id', (req, res) => {
  const { name, isDone } = req.body
  const id = req.params.id

  return Todo.update(
    {
      name,
      isDone: isDone === 'on'
    },
    { where: { id } }
  )
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.error(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Todo.destroy(
    {
      where: { id }
    }
  )
    .then(() => res.redirect('/'))
    .catch((error) => console.error(error))
})

module.exports = router
