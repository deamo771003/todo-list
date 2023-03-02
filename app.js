const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

const bodyParser = require('body-parser')

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

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 啟動hbs
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // app.engine('指定副檔名', 模板 ({ main通用模板檔案, extname要被渲染的副檔名 }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  // take all Todo data
  Todo.find() // 抓所有資料
    .lean() // 未經處裡的乾淨資料
    .then(todos => res.render('index', { todos })) // 然後...將todos資訊傳入index畫面
    .catch(error => console.log(error)) // 抓取到錯誤則顯示錯誤資訊
})

// 建立/todos/new路由
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// 設定一條新的路由，來接住表單資料，並且把資料送往資料庫。這個步驟就是 CRUD 裡的 Create 動作
app.post('/todos', (req, res) => {
  const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})