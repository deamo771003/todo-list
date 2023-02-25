// app.js
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

const app = express()

mongoose.connect('mongodb+srv://deamo771003:773001love@jimmylin.mg8evxp.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true }) // 設定連線到 mongoDB
// 取得資料庫連線狀態
const db = mongoose.connection


// // 加入這段 code, 僅在非正式環境時, 使用 dotenv
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.send('hollow world3')
})

app.listen(3000, () => {
  console.log('app is running on port 3000.')
})