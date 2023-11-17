const mongoose = require('mongoose');

const connectDB = async(URL)=>{
    try {
        await mongoose.connect(URL)
        console.log('Successfully connected to mongoDB')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB

