const express = require('express')
const router = express.Router()
// 引用Todo model
const Todo = require('../../models/todo')
// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id
  // take all Todo data
  Todo.find({ userId: userId }) // 抓Todo資料庫userId = 
    .lean() // 未經處裡的乾淨資料
    .sort({ _id: 'asc' }) // mongoose資料排序功能，使用_id順向排序
    .then(todos => res.render('index', { todos })) // 然後...以todos為資訊傳入index畫面
    .catch(error => console.log(error)) // 抓取到錯誤則顯示錯誤資訊
})
// 匯出路由
module.exports = router