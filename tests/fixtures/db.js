const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Steve",
    email: "stevep@hotmail.com",
    password: "supersecret123",
    tokens: [{
        token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Nicky",
    email: "nicky@hotmail.com",
    password: "232324ferferf",
    tokens: [{
        token: jwt.sign({_id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First task",
    completed: false,
    owner: userOneId
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "second task",
    completed: true,
    owner: userOneId
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "third task",
    completed: true,
    owner: userTwoId
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await User(userOne).save()
    await User(userTwo).save()
    await Task(taskOne).save()
    await Task(taskTwo).save()
    await Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    taskOne,
    setupDatabase
}