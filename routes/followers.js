const express = require("express");
const router = express.Router()
const Followers = require('../models/followers');

// Getting all records
router.get('/',async (req, res)=>{
    try {
        const followers = await Followers.find()
        res.json(followers)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    eventLog(req,res)
})

// Creating record
router.post('/', async (req, res)=>{
    const follower = new Followers({
        name: req.body.name,
        followed: req.body.followed,
    })
    try {
        const newFollower = await follower.save()
        res.status(201).json(newFollower) 
    } catch(err) {
        res.status(400).json({message: err.message})
    }
    eventLog(req, res)
})

// Getting one record
router.get('/:id', getFollower, (req, res)=>{
    res.json(res.follower)
    eventLog(req, res)
})

// Update record
router.patch('/:id', getFollower, async (req, res)=>{
    if (req.body.name != null) {
        res.follower.name = req.body.name
    }
    if (req.body.followed != null) {
        res.follower.followed = req.body.followed
    }
    try {
        const updatedFollower = await res.follower.save()
        res.json(updatedFollower)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
    eventLog(req, res)
})

// Delete record
router.delete('/:id', getFollower, async (req, res)=>{
    try {
        await res.follower.deleteOne()
        res.json({message: res.follower.id + " record deleted"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    eventLog(req, res)
})

// event Logger
function eventLog(req, res) {
    let date = new Date()
    console.log(`
┌ ${date.toTimeString()}
├ request____:${req.method} ${req.baseUrl} ${req.url}
└ response___:${res.statusCode} ${res.statusMessage}`)
}

// Middleware
async function getFollower(req, res, next) {
    let follower
    try {
        follower = await Followers.findById(req.params.id)
        if (follower == null) {
            return res.status(404).json({message: 'Cannot find follower'})
        }
    } catch (err) {
        if(err.kind === "ObjectId") {
            return res.status(404).json({message: "ID error"})
        }
        return res.status(500).json({message: err.kind})
    }
    res.follower = follower
    next()
}

module.exports = router

