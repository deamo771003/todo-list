const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean, // true & false
    default: false // 預設為false(沒打勾)
  }
})

module.exports = mongoose.model('Todo', todoSchema)
// 使用 Mongoose 創建一個名為 Todo 的 Model，Model 是 Mongoose 用來處理資料庫操作的一個介面，
// 可以用來創建、讀取、更新、刪除資料等操作。這個 Model 會與 todoSchema 這個 Mongoose 的 Schema 進行連結
// ，並且被匯出，讓其他的應用程式可以透過這個 Model 來操作資料庫中的資料。
// 所以在其他的檔案中，可以透過 require('./models/todo') 載入這個 Model，並使用 Todo 這個物件來進行資料庫的操作。