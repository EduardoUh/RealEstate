import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';


const protectRoute = async (req, res, next) => {
    // console.log('From Middleware');

    // check if a jwt exists
    //console.log(req.cookies._token);
    const { _token } = req.cookies;
    if (!_token) {
        return res.redirect('/auth/login');
    }

    // verify jwt 
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.scope('deleteUnnecessaryFields').findByPk(decoded.id);
        // console.log(user);
        // Store user in the req
        if (user) {
            req.user = user;
        }
        else {
            return res.redirect('/auth/login');
        }
        return next();
    }
    catch (err) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default protectRoute;
