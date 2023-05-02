const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// login
router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // 驗證成功轉址
  failureRedirect: '/users/login' // 驗證失敗轉址
}))

// register
router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符。' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 email 已經註冊過了。' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }

    return bcrypt
      .genSalt(10) // 加鹽,係數10
      .then(salt => bcrypt.hash(password, salt)) // 使用者密碼加鹽後雜湊
      .then(hash => User.create({
        name,
        email,
        password: hash // 加鹽雜湊後存入資料庫
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router