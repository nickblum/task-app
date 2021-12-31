require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete("61cf44ef41cdf57f5d9d814c").then(()=>{
//     return Task.countDocuments({ completed: false })
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async (_id) => {
    await Task.findByIdAndDelete(_id)
    return await Task.countDocuments({ completed: false })
}

deleteTaskAndCount("61cf644a2eccc82744ba4818").then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})