const Todo = require('../todo') // 載入model/todo

const db = require('../../config/mongoose') // 呼叫mongoose裡的db

db.once('open', () => {
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` })
  }
  console.log('done')
})