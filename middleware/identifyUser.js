import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const identifyUser = async (req, res, next) => {
    // check if there is a token
    const { _token } = req.cookies;
    if (!_token) {
        req.user = null;
        return next();
    }
    // verify token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const user = await User.scope('deleteUnnecessaryFields').findByPk(decoded.id);

        if (user) {
            req.user = user
        }
        return next();
    }
    catch (err) {
        console.log(err);
        return res.clearCookie('_token').redirect('/auth/login');
    }
};

export default identifyUser;
