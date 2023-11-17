const CustomAPIError = require('../error/custom-error');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn');
const checkUser = async(req,res) =>{
    const { email } = req.body;
    
  
    const checkEmailExsist = await User.find({email:email.toLowerCase()});

    if(checkEmailExsist.length > 0)
    throw new CustomAPIError("This email is registered before",400);

    return res.status(200).json({msg:"Valid"})
   
}


const addUser = async(req,res) =>{

    const { email, firstname, lastname, password } = req.body;

    if(!email || !firstname || !lastname ||!password)
    {
        throw new CustomAPIError("Something went wrong",400);
    }

    const checkEmailExsist = await User.find({email:email.toLowerCase()});

    if(checkEmailExsist.length > 0)
    throw new CustomAPIError("This email is registered before",400);

    // if not exsist before

    const passwordStrength = zxcvbn(password);

    if(passwordStrength.score < 3)
    {
        throw new CustomAPIError("Please use a stronger password for your safety",400)
    }


     bcrypt.hash(password,10,async(err,hash)=>{
        
        try {
            const createdUser = await User.create({
                firstname:firstname,
                lastname:lastname,
                email:email.toLowerCase(),
                password:hash
            });
            console.log(createdUser);
        } catch (error) {
            throw new CustomAPIError("There was an error while creating your account",500)
        }
    })

    res.status(200).json({msg:"Successfully created your account."});


}

module.exports = {
    checkUser,
    addUser
}