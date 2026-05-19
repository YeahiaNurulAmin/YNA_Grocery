import jwt from "jsonwebtoken";


const authUser = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({success: false, message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.id) {
            req.userId = decoded.id;
            req.body = req.body || {}; 
            req.body.userId = decoded.id;
        } else {
            return res.status(401).json({success: false, message: "Unauthorized"});
        }

        next();

    } catch (error) {
        console.error("Error in authUser middleware:", error);
        return res.status(401).json({success: false, message: "Unauthorized"});
    }
}

export default authUser;