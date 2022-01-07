const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const mwAuth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = express.Router()

/**
 * USER PROFILE ROUTES
 */

/*** GET ***/
 // get logged in user profile
router.get('/users/me', mwAuth, async (req,res) => {
    res.send(req.user)
})

/*** POST ***/
// create a new user
router.post('/users', async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e) // bad request
    }
})
//login user
router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send()
    }
})
//logout user
router.post('/users/logout', mwAuth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//logout all sessions/devices
router.post('/users/logoutAll', mwAuth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//*** PATCH ***/
router.patch('/users/me', mwAuth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({'error':'Invalid update'})
    }

    try {
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e) // bad request
        // ignoring 500/server errors for now
    }
})

/*** DELETE ***/
// Delete authenticated user
router.delete('/users/me', mwAuth, async (req,res)=>{
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    } 
})


/**
 * PROFILE IMAGE ROUTES
 */
/*** GET ***/
router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new Error()
        } 

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e){
        res.status(400).send()
    }
})

/*** POST ***/
// Upload profile image
const upload = multer({
    //dest: 'images', // comment out in order to pass data through to the route, not put in folder
    limits: {
        fileSize: 1000000 // 1Mb
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image (JPG, JPEG, or PNG)'))
        }
        // cb(new Error('Please upload an image'))
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', mwAuth, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer)
        .resize({width: 250, height: 250 })
        .png()
        .toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

/*** DELETE ***/
// Delete user profile image
router.delete('/users/me/avatar', mwAuth, async (req,res)=>{
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    } 
})

module.exports = router