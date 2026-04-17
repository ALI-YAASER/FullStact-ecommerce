import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    // لو مفيش توكن، هنعديه عادي ونخلي الـ userId فاضي
    if (!token) {
        req.userId = null; 
        return next();
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id || token_decode.userId; 
        next();
    } catch (error) {
        // لو التوكن منتهي أو فيه مشكلة، برضه هنعديه كـ Guest 
        // عشان الأوردر ميفشلش لو اليوزر نسي يسجل دخول
        console.log("⚠️ Token invalid, proceeding as guest");
        req.userId = null;
        next();
    }
};

export default authUser;