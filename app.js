const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

const Todo = require('./models/todo')

const exphbs = require('express-handlebars')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 啟動hbs
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  // take all Todo data
  Todo.find() // 抓所有資料
    .lean() // 未經處裡的乾淨資料
    .then(todos => res.render('index', { todos })) // 然後...將todos資訊傳入index畫面
    .catch(error => console.log(error)) // 抓取到錯誤則顯示錯誤資訊
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})