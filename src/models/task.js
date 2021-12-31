const mongoose = require('mongoose')

const Task = mongoose.model('Task',{
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const myTask = new Task({description: "Honor my family" })
// myTask.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })
module.exports = Task