const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

// automatically parse into an object so that we can use it in our handlers below
app.use(express.json())

/**
 * USER ENDPOINTS
 */
app.get('/users', async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})
app.get('/users/:id', async (req,res)=>{
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    } 
})
app.post('/users', async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e) // bad request
    }
})

/**
 * TASK ENDPOINTS
 */
app.get('/tasks', async (req,res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
app.get('/tasks/:id', async (req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) return res.status(400).send()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
app.post('/tasks', async (req,res)=>{
    try {
        const task = new Task(req.body)
        await task.save() 
        res.status(201).send(task) // 201 == "created"
    } catch (e) {
        res.status(400).send(e) // bad request
    }
})


/**
 * STARTUP / LISTEN
 */
app.listen(port,()=>{
    console.log('App is running on port ' + port);
})