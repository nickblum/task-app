const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// automatically parse into an object so that we can use it in our handlers below
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('App is running on port ' + port);
})

// const bcrypt = require('bcrypt')
// const myFunction = async () => {
//     const pass = 'nothing124324'
//     const hashpass = await bcrypt.hash(pass, 8) 

//     console.log(pass)
//     console.log(hashpass)

//     const isMatch = await bcrypt.compare('nothing124324', hashpass)
//     console.log(isMatch)
// }
// myFunction()