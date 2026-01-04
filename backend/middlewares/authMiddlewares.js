import jwt from 'jsonwebtoken'


export const authMiddleware = async (req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Error while verifying. Please Login again"
            })
        }
        const data = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = data;
        next();
    }
    catch(err){
        console.log("Error during verificaton \n",err);
        return res.status(403).json({
            success:false,
            message:"Invalid or expired token"
        })
    }
}
