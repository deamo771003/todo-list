const express = require('express')
const router = express.Router()
// 引用Todo model
const Todo = require('../../models/todo')

// 建立/todos/new路由
router.get('/new', (req, res) => {
  return res.render('new')
})
// 設定一條新的路由，來接住表單資料，並且把資料送往資料庫。這個步驟就是 CRUD 裡的 Create 動作
router.post('/', (req, res) => { // 對應new.hbs的form/action，因此檔案名稱為todos，再搭配index的設定，故'/'就等於/todos
  const bodyName = req.body.name // 從 req.body(使用者submit的資訊) 拿出表單裡的 name 資料
  const todos = String(bodyName).split(',').map(todo => ({ name: todo })); // 以','分開的多筆匯入
  return Todo.insertMany(todos) // 多筆存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})
//   return Todo.create({ bodyName }) // 存入資料庫
//     .then(() => res.redirect('/')) // 新增完成後導回首頁
//     .catch(error => console.log(error))
// })

// detail 路由
router.get('/:id', (req, res) => {
  const id = req.params.id // params.id就是抓以上網址:id的資料參數
  return Todo.findById(id) // 用網址參數id到Todo資料庫內找與mongoose流水ID相符的資料
    .lean()
    .then(todo => res.render('detail', { todo })) // 使用detail文檔加入todo數據
    .catch(error => console.log(error))
})

// edit 路由
router.get('/:id/edit', (req, res) => {
  const id = req.params.id // params.id就是抓以上網址:id的資料參數
  return Todo.findById(id) // 用網址參數id到Todo資料庫內找與mongoose流水ID相符的資料
    .lean()
    .then(todo => res.render('edit', { todo })) // 使用detail文檔加入todo數據
    .catch(error => console.log(error))
})
// edit 存取使用者資料
router.put('/:id', (req, res) => {
  const id = req.params.id
  // const name = req.body.name // name = 使用者key的name ??
  // const isDone = req.body.isDone
  const { name, isDone } = req.body // 解構複值，等於以上語法的縮寫
  return Todo.findById(id)
    .then(todo => {
      todo.name = name // 覆蓋原本todo.name
      // if (isDone === 'on') {
      //   todo.isDone = true
      // } else {
      //   todo.isDone = false
      // }
      todo.isDone = isDone === 'on' // 等於以上if縮寫，因為isDone === 'on'就是true
      return todo.save() // 執行mongoose儲存功能
    })
    .then(() => res.redirect(`/`)) // 以上動作結束後不用任何動作直接導向首頁 
    .catch(error => console.log(error)) // 以上只要有錯誤則跳錯誤訊息
})

// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/')) // 以上動作結束後不用任何動作直接導向首頁 
    .catch(error => console.log(error))
})

// 匯出路由
module.exports = router

