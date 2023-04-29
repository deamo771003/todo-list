const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// login
router.get('/login', (req, res) => {
  return res.render('login')
})

module.exports = router