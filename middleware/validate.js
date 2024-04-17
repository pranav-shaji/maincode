let jwt = require("jsonwebtoken");


let validate = (req,res,next)=>{
 console.log(req.headers.authorization);

 if(req.headers.authorization){
    let token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try {
        let decode= jwt.verify(token,'123');
        console.log(decode);
        next();
    } catch (error) {
        console.log(error);
        res.json({message:"not validated"})
    }
 }else{
    res.json({message: 'No Token Provided'});
 }
};
module.exports =  validate;