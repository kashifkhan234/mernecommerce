
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config/db')
const router = require('./routes');
const cookieParser = require('cookie-parser');




const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use("/api",router)
app.use(cookieParser())

const PORT = 3001 || process.env.PORT


connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log('connected to DB')
        console.log('Server is running')
})
})