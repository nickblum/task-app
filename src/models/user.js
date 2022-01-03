const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error("Invalid password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

/**
 * userSchema.methods == methods on an individual instance of the user model
 */
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Generate user specific web token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'myuniquecharacters')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

/**
 * userSchema.statics == methods on User model
 */
// Verify user credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch){
        throw new Error('Invalid credentials. Unable to login.')
    }

    return user
} 

// Hash the plaintext password before saving
userSchema.pre("save", async function(next){
    const user = this

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const User = mongoose.model('User',userSchema)

// const me = new User({name: "Danny", email: 'danny@hi.com', password: 'mypas1234' })
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

module.exports = User