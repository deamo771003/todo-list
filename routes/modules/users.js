const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// login
router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
  return res.render('register')
})

module.exports = router