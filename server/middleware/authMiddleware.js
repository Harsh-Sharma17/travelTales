const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decoded.userId;

        next();
    }catch(error){
        console.error("Invalid token: ", error);    
        res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;