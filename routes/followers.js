const express = require("express");
const router = express.Router()
const Followers = require('../models/followers');

// Getting all records
router.get('/', async (req, res)=>{
    console.log("request: GET all records")
    try {
        const followers = await Followers.find()
        res.json(followers)
        console.log("request: GET all records: SUCCESS")
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Creating record
router.post('/', async (req, res)=>{
    console.log("request: POST create new record")
    const follower = new Followers({
        name: req.body.name,
        followed: req.body.followed,
    })
    try {
        const newFollower = await follower.save()
        res.status(201).json(newFollower)
        console.log("request: POST create new record: SUCCESS")
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// Getting one record
router.get('/:id', getFollower, (req, res)=>{
    res.json(res.follower)
    console.log("request: GET by id:" + res.follower.id  + " SUCCESS")
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
        console.log("request: PATCH by id:" + res.follower.id + " SUCCESS") 
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Delete record
router.delete('/:id', getFollower, async (req, res)=>{
    try {
        await res.follower.deleteOne()
        res.json({message: res.follower.id + " record deleted"})
        console.log("request: DELETE id:" + res.follower.id + " SUCCESS")
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Middleware
async function getFollower(req, res, next) {
    console.log("Incoming request by ID")
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

