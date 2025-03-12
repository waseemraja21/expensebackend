import jwt from "jsonwebtoken";


const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })


    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, //milli seconds
        httpOnly: true, // prevent XSS attacks or cross scripting attacks
        sameSite: 'strict', //csrf cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    });
    return token;
}

export default generateTokenAndSetCookie;