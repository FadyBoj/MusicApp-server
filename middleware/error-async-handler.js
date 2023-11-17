const CustomAPIErrorr = require('../error/custom-error');


const errorAsyncHandler = (err,req,res,next) =>{
    if(err instanceof CustomAPIErrorr)
    {
        return res.status(err.statusCode).json({msg:err.message});
    }
   
    return res.status(500).json({msg:"Something went wrong in the server :("});
}

module.exports = errorAsyncHandler;