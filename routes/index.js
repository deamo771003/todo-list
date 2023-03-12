// 引用 Express 與 Express 路由器
const express = require('express')
// 引入路由模組
const router = express.Router()
const todos = require('./modules/todos')

const home = require('./modules/home')
router.use('/', home) // 如果request路徑是'/'，就執行home的程式碼
router.use('/todos', todos)
// 匯出路由器
module.exports = router
