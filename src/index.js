const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// automatically parse into an object so that we can use it in our handlers below
app.use(express.json())

app.post('/users',(req,res)=>{
    console.log(req.body)
    res.send('testing user')
})

app.listen(port,()=>{
    console.log('App is running on port ' + port);
})