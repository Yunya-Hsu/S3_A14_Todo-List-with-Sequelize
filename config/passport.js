const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

module.exports = app => {
  // middleware: 初始化Passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定 local strategy
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) { // 找不到使用者
          return done(null, false)
          // req.flash('loginError_msg', 'That account is not registered!')
        }
        return bcrypt.compare(password, user.password) // 判斷「使用者輸入的密碼」與「mongoDB儲存的密碼」是否相符
          .then(isMatch => {
            if (!isMatch) { // bcrypt.compare會回傳isMatch為true或false
              return done(null, false)
              // req.flash('loginError_msg', 'Email or Password incorrect.')
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  // session：序列化＆反序列化
  // 只把 user 的 _id(MongoDB生成的) 保存在 req.session.passport.user 中
  passport.serializeUser((user, done) => {
    console.log("審核過的使用者資料：", user)
    done(null, user.id)
  })
  // 透過 id 找回詳細的 user 資料並存放在 req.user 中
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}
