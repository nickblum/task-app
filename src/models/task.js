const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
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

// middleware
taskSchema.pre("save", async function(next){
    ///const task = this

    console.log('task saving middleware...')

    next()
})

const Task = mongoose.model('Task',taskSchema)

// const myTask = new Task({description: "Honor my family" })
// myTask.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })
module.exports = Task