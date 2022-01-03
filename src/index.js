const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// custom middleware to verify token
// app.use((req,res,next)=>{
//     if ( req.method === 'GET' ){
//         res.send('Get requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently down for maintenance')
// })

// automatically parse into an object so that we can use it in our handlers below
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('App is running on port ' + port);
})

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('61d35411fe7f3f76367e354b')
//     // await task.populate('owner')//.execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('61d3513d5294a6cb5a6d95da')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()