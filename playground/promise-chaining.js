require('../src/db/mongoose')
const User = require('../src/models/user')


// User.findByIdAndUpdate("61cd3089a59079329b81b59c", { age: 1 }).then((user)=>{
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeAndCount = async (_id, age) => {
    const user = await User.findByIdAndUpdate(_id, { age })
    const count = await User.countDocuments({ age })   
    return count
}

updateAgeAndCount("61cd3089a59079329b81b59c",3).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})