const users = []
const User = require('./User')

exports.update = exports.create = (id, name, surname, email, password) => {
  return new Promise((resolve) => {
    users[id] = new User(id, name, surname, email, password)
    resolve(users[id])
  })
}

exports.read = (id) => {
  return new Promise((resolve, reject) => {
    if (users[id]) resolve(users[id])
    else reject(`User ${id} does not exist`)
  })
}

exports.destroy = (id) => {
  return new Promise((resolve, reject) => {
    if (users[id]) {
      delete users[id]
      resolve
    } else {
      reject(`User ${id} does not exist`)
    }
  })
}

exports.ids = () => {
  return new Promise((resolve) => {
    resolve(Object.keys(users))
  })
}

exports.count = () => {
  return new Promise((resolve) => {
    resolve(users.length)
  })
}