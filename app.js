const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')

const routes = require('./routes')

// const { request } = require('express') // ??

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()

require('./config/mongoose') // 載入mongoose資料 
// 以下移至mongoose集中管理
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
// // 取得資料庫連線狀態 
// const db = mongoose.connection
// // 連線異常
// db.on('error', () => {
//   console.log('mongodb error!')
// })
// // 連線成功
// db.once('open', () => {
//   console.log('mongodb connected!')
// })

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 啟用並定義methodOverride
app.use(methodOverride('_method'))// <form>action路由後方加入?_method=XXX就可修改method屬性(HTTP預設只能POST&GET)

// 啟動hbs
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // app.engine('指定副檔名', 模板 ({ main通用模板檔案, extname要被渲染的副檔名 }))
app.set('view engine', 'hbs')

app.use(routes)
// 以下分至routes集中管理
// const Todo = require('./models/todo')
// app.get('/', (req, res) => {
//   // take all Todo data
//   Todo.find() // 抓所有資料
//     .lean() // 未經處裡的乾淨資料
//     .sort({ _id: 'asc' }) // mongoose資料排序功能，使用_id順向排序
//     .then(todos => res.render('index', { todos })) // 然後...以todos為資訊傳入index畫面
//     .catch(error => console.log(error)) // 抓取到錯誤則顯示錯誤資訊
// })

// // 建立/todos/new路由
// app.get('/todos/new', (req, res) => {
//   return res.render('new')
// })

// // 設定一條新的路由，來接住表單資料，並且把資料送往資料庫。這個步驟就是 CRUD 裡的 Create 動作
// app.post('/todos', (req, res) => {
//   const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
//   return Todo.create({ name }) // 存入資料庫
//     .then(() => res.redirect('/')) // 新增完成後導回首頁
//     .catch(error => console.log(error))
// })

// // detail 路由
// app.get('/todos/:id', (req, res) => {
//   const id = req.params.id // params.id就是抓以上網址:id的資料參數
//   return Todo.findById(id) // 用網址參數id到Todo資料庫內找與mongoose流水ID相符的資料
//     .lean()
//     .then(todo => res.render('detail', { todo })) // 使用detail文檔加入todo數據
//     .catch(error => console.log(error))
// })

// // edit 路由
// app.get('/todos/:id/edit', (req, res) => {
//   const id = req.params.id // params.id就是抓以上網址:id的資料參數
//   return Todo.findById(id) // 用網址參數id到Todo資料庫內找與mongoose流水ID相符的資料
//     .lean()
//     .then(todo => res.render('edit', { todo })) // 使用detail文檔加入todo數據
//     .catch(error => console.log(error))
// })

// // edit 存取使用者資料
// app.put('/todos/:id', (req, res) => {
//   const id = req.params.id
//   // const name = req.body.name // name = 使用者key的name ??
//   // const isDone = req.body.isDone
//   const { name, isDone } = req.body // 解構複值，等於以上語法的縮寫
//   return Todo.findById(id) // ??
//     .then(todo => {
//       todo.name = name // 覆蓋原本todo.name
//       // if (isDone === 'on') {
//       //   todo.isDone = true
//       // } else {
//       //   todo.isDone = false
//       // }
//       todo.isDone = isDone === 'on' // 等於以上if縮寫，因為isDone === 'on'就是true
//       return todo.save() // 執行儲存
//     })
//     .then(() => res.redirect(`/todos/${id}`)) // 以上動作結束後不用任何動作直接導向首頁 
//     .catch(error => console.log(error)) // 以上只要有錯誤則跳錯誤訊息
// })

// // delete
// app.delete('/todos/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findById(id)
//     .then(todo => todo.remove())
//     .then(() => res.redirect('/')) // 以上動作結束後不用任何動作直接導向首頁 
//     .catch(error => console.log(error))
// })

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})

