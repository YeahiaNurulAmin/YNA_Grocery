import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
    const {sellerToken } = req.cookies;

    if(!sellerToken) {
        return res.status(401).json({success: false, message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

        if(decoded.email === process.env.SELLER_EMAIL) {
            next();
        }else {
            return res.status(401).json({success: false, message: "Unauthorized"});
        }


    }catch (error) {
        console.error("Error in authSeller middleware:", error);
        return res.status(401).json({success: false, message: "Unauthorized"});
    }
}

export default authSeller;