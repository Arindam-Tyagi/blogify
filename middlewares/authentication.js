const { validateToken } = require("../services/authentication");

function checkAuthenticationCookies(cookieName){
    return (req,res,next)=>{
        const cookieValue=req.cookies[cookieName];
        try {
            if(!cookieValue) return next();

            const UserPayload = validateToken(cookieValue);
            req.user=UserPayload;

        } catch (error) {
            console.log("error ",error);
        }
        return next();
    }
}

module.exports ={
    checkAuthenticationCookies
}