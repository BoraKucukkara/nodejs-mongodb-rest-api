require('dotenv').config()
const express = require('express')
const app = express()

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log("Connected to DB/followers"))
.catch((err)=> console.error(err))


app.listen(5001, () => console.log("▶️ Server Started"))