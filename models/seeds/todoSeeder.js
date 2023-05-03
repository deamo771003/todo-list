const bcrypt = require('bcryptjs')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Todo = require('../todo') // 載入model/todo
const User = require('../user')
const db = require('../../config/mongoose') // 呼叫mongoose裡的db
const SEED_USER = {
  name: 'root',
  email: 'root@example',
  password: '12345678'
}

// Mongoose 連線成功
db.once('open', () => {
  bcrypt // 加鹽雜湊
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({ // databast建立 seeder 資料
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id // 因上面database以create資料，故已產出 _id
      return Promise.all(Array.from(
        { length: 10 }, // ! ?
        (_, i) => Todo.create({ name: `name-${i}`, userId }) // ! ?
      ))
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})