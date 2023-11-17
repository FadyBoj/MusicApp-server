const mongoose = require('mongoose');

const User = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    favoriteSongs:{
        type:Array,
        required:false
    },
    google:{
        type:Boolean,
        required:true,
        default:false
    },
    verificationCode:{
        code:{
            type:Number,
            required:true,
            default:Math.floor(Math.random() * 99999999)
        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now()
        }
    }
})

module.exports = mongoose.model('User',User);