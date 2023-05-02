const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        // bcrypt朔回比對功能(使用者輸入的值, 資料庫裡的值)回傳布林值
        return bcrypt.compare(password, user.password).then(isMach => {
          if (!isMach) {
            return done(null, false, { message: 'Email or Password incorrect!' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  // 設定facebook登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // 需與FB拿回的資料,displayName = fb上公開名稱
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user) // 如果database已有資料就回傳
        // 由於屬性 password 有設定必填，我們還是需要幫使用 Facebook 註冊的使用者製作密碼。因此這裡刻意設定一串亂碼
        const randomPassword = Math.random().toString(36).slice(-8) // 亂數a-z 1-9字串，取最後8位字串
        // 加鹽雜湊加密
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt)) // randomPassword加鹽後雜湊
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          // passport驗證成功後，呼叫done(err,user,info)，本案為驗證成功done(沒錯誤,user傳給done)
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}