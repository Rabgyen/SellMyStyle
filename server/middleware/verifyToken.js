const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json("Access Denied");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET,(err,user) => {
        if(err){
            return res.status(403).json("Invalid Token");
        }

        req.user=user;

        next();
    })

}
module.exports=verifyToken