const isAuthenticated = require('./../middlewares/auth'); 
const userService = require('./../services/userService'); 

module.exports = (req, res, next) =>{
    isAuthenticated(req,res, async function(){
        try {
            const { user } = await userService.getUser(req.user.id);
            console.log(user.role)

            if(user.role !=="admin"){
                throw new Error("Valid Token but not authorized as admin!")
            }
        
            next();

        
        }catch(error) {
            return res.status(401).json({
                status: false,
                data : {
                    msg  : error.message
                }
            })
        }      
    })
}