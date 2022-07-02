const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login', {
    successLogout: req.flash('successLogout'),
    registerSuccess: req.flash('registerSuccess'),
    notLogin: req.flash('notLogin'),
    loginFail: req.flash('loginFail')
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
})
)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password || !confirmPassword) {
    req.flash('somethingMissing', '請確認所有欄位皆已填寫，再送出')
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword,
      somethingMissing: req.flash('somethingMissing')
    })
  }

  if (password !== confirmPassword) {
    req.flash('wrongConfirm', '輸入密碼與確認密碼不相符，請重新輸入')
    return res.render('register', {
      name,
      email,
      password,
      wrongConfirm: req.flash('wrongConfirm')
    })
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        req.flash('existedUser', '此帳號已經存在，請選擇其他email進行註冊')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
          existedUser: req.flash('existedUser')
        })
      }

      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => {
          req.flash('registerSuccess', '您已成功註冊，請登入帳號')
          res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('successLogout', '您已成功登出')
  res.redirect('/users/login')
})

module.exports = router
