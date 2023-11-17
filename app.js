require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./connect/db');
const cookieParser = require('cookie-parser');
const axios = require('axios');
//Routes
const usersRoute = require('./routes/users-route');
const spotifyApi = require('./routes/spotify-api');
//middleware
const errorAsyncHandler = require('./middleware/error-async-handler');

app.use(express.json())
app.use(cors());
app.use(cookieParser());

app.use('/users',usersRoute)
app.use('/spotify-api',spotifyApi);

app.use(errorAsyncHandler);

const port = process.env.port || 8000;

//Self Pinging

app.get('/self-ping',(req,res) =>{
    res.status(200).json({msg:"Successfully self pinged"})
})

setInterval(async() =>{

    try {
        const { data } = await axios.get('https://megnwene.onrender.com/self-ping');
        console.log("Pinged")
    } catch (error) {
        console.log("Error while self pinging")
    }

},1000 * 60)

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_SECRET)
        app.listen(port,() =>{
            console.log(`Server is running on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

//error middleware


start()