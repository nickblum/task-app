const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mwAuth = require('../middleware/auth')

/**
 * GET
 */
// get logged in user profile
router.get('/users/me', mwAuth, async (req,res) => {
    res.send(req.user)
})

/**
 * POST
 */
// create a new user
router.post('/users', async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
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

/**
 * PATCH
 */
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

/**
 * DELETE
 */
router.delete('/users/me', mwAuth, async (req,res)=>{
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    } 
})

module.exports = router