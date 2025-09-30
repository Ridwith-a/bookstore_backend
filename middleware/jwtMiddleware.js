// routes
// --------
const jwt = require('jsonwebtoken')

const jwtMiddleware= (req , res , next)=>{
    console.log('inside jwt Middleware');
    const token = req.headers["authorization"].slice(7)
    try{
        const jwtResponse = jwt.verify(token,process.env.JWTSECRETKEY)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        next()
        
    }catch(error){
        res.status(400).json('Authorization failed',error)
    }
    
    

}

module.exports = jwtMiddleware