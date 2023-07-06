import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateId, generateJWT } from '../helpers/tokens.js';
import { signupEmail, forgotPasswordEmail } from '../helpers/emails.js';

const loginForm = (req, res) => {
    res.render('auth/login.pug', {
        page: 'Sign in',
        csrfToken: req.csrfToken()
    });
}

const authenticateUser = async (req, res) => {
    await check('email').isEmail().withMessage('Email is necessary to sign in').run(req);
    await check('password').notEmpty().withMessage('Password is necessary to sign in').run(req);
    const result = validationResult(req);
    const { email, password } = req.body;
    if (!result.isEmpty()) {
        return res.render('auth/login.pug', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            email
        })
    }
    const user = await User.findOne({ where: { email } });
    // res.json({ user });
    if (!user) {
        return res.render('auth/login.pug', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'User is not resgistered' }]
        });
    }
    if (!user.confirmed) {
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'User account is not confirmed, please go to the email we sent you and confirm your account' }],
            email
        });
    }

    if (!user.verifyPassword(password)) {
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Password doesn\'t match to existing password' }],
            email
        })
    }
    // res.json(user);
    // Authenticate user
    const token = generateJWT({ id: user.id, name: user.name });
    // console.log(token);
    // Store JWT in cookies

    return res.cookie('_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true
    }).redirect('/my-properties');

};

const logOut = async (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/');
}

const signupForm = (req, res) => {
    // console.log(req.csrfToken());
    res.render('auth/signup.pug', {
        page: 'Sign Up',
        csrfToken: req.csrfToken()
    });
};

const registerUser = async (req, res) => {
    // validation
    // console.log(req.body);
    await check('name').notEmpty().withMessage('Name field is empty').run(req);
    await check('email').isEmail().withMessage('That doesn\'t look like an email').run(req);
    await check('password').isLength({ min: 8 }).withMessage('Password should have at least 8 characters').run(req);
    // const eduardo = await check('reenter_password').equals('password').withMessage('Both passwords must match').run(req);
    await check('confirm_password').custom((value, { req }) => (value === req.body.password)).withMessage('Both passwords must match').run(req);
    // console.log(eduardo);
    const { name, email, password } = req.body;
    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render('auth/signup.pug', {
            page: 'Sign Up',
            errors: result.array(),
            user: {
                name,
                email,
            },
            csrfToken: req.csrfToken()
        })
    }
    // Check for duplicated users
    const userExists = await User.findOne({ where: { email } });
    // console.log(userExists);
    if (userExists) {
        return res.render('auth/signup.pug', {
            page: 'Sign Up',
            errors: [{ msg: 'User with the provided email already exists' }],
            user: {
                name,
                email,
            },
            csrfToken: req.csrfToken()
        })
    }
    // Save user
    const user = await User.create({
        name,
        email,
        password,
        token: generateId(),
    });
    // Send confirmation email
    signupEmail({
        name: user.name,
        email: user.email,
        token: user.token,
    });
    // Confirm your account message
    res.render('templates/message.pug', {
        page: 'Account created successfully',
        message: `Thank you for signing up!\nCheck the confirmation email at ${email}`
    })
}
// confirm account function
const confirmAccount = async (req, res) => {
    const { token } = req.params;
    // al trabajar con un ORM los datos traidos de la bd son tratados como objetos y por tanto
    // sus atributos pueden ser accedidos y modificados de la misma manera
    const user = await User.findOne({ where: { token } });
    // console.log(user);
    if (!user) {
        return res.render('auth/confirm-account.pug', {
            page: 'Unable to confirm account',
            error: true,
            msg: 'An error occurred while verifying account, please try again.'
        });
    }
    // modificando atributos del objeto usuario traido previamente
    user.token = null;
    user.confirmed = true;
    // guardando los cambios hechos al objeto usuario en la base de datos
    await user.save();
    return res.render('auth/confirm-account.pug', {
        page: 'Account confirmed successfully',
        msg: 'Your account has been confirmed'
    })
};
// render forgot password view
const forgotPassword = (req, res) => {
    res.render('auth/forgot-password.pug', {
        page: 'Recover your access to Bienes Raices',
        csrfToken: req.csrfToken()
    })
};
// reset password
const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('That doesn\'t look like an email').run(req);
    let result = validationResult(req);
    // render if there is any error
    if (!result.isEmpty()) {
        return res.render('auth/forgot-password.pug', {
            page: 'Recover your access to Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        });
    }
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    // render if user is not registrated
    if (!user) {
        return res.render('auth/forgot-password.pug', {
            page: 'Recover your access to Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Invalid email, that email is not registered.' }],
        })
    }
    // if user is registrated
    user.token = generateId();
    await user.save();
    forgotPasswordEmail({
        name: user.name,
        email: user.email,
        token: user.token
    });
    res.render('templates/message.pug', {
        page: 'Reset password request',
        message: `You requested a reset of your password, check the email at ${email}`
    });
};

const verifyToken = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ where: { token } });
    // if token is not valid
    if (!user) {
        return res.render('auth/confirm-account.pug', {
            page: 'Reset your password',
            error: true,
            msg: 'An error occurred while verifying account info, please try again.'
        });
    }
    // if token is valid, show reset password form
    // console.log(user);
    res.render('auth/reset-password.pug', {
        page: 'Reset your password',
        csrfToken: req.csrfToken()
    });
};

const newPassword = async (req, res) => {
    await check('new_password').isLength({ min: 8 }).withMessage('Password should have at least 8 characters').run(req);
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render('auth/reset-password.pug', {
            page: 'Reset your password',
            csrfToken: req.csrfToken(),
            errors: result.array()
        });
    }
    // console.log(req.body.new_password, req.params.token);
    const { token } = req.params;
    const { new_password } = req.body;
    const user = await User.findOne({ where: { token } });
    /* console.log(token);
    console.log(new_password);
    console.log(user.password); */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    user.token = null;
    await user.save();
    res.render('auth/confirm-account.pug', {
        page: 'Password reset successfully',
        msg: 'Now you can sign in'
    });
};

const userProfile = async (req, res) => {
    const { id } = req.user;
    const user = await User.findByPk(id, { raw: true });
    if (!user) {
        return res.clearCookie('_token').status(200).redirect('/auth/signup');
    }
    if (user.id.toString() !== id.toString()) {
        return res.clearCookie('_token').status(200).redirect('/auth/login');
    }
    res.render('user/user-profile', {
        page: `User profile - ${user.name}`,
        csrfToken: req.csrfToken(),
        name: user.name,
        email: user.email,
        userId: user.id
    });
}

const updateInfo = async (req, res) => {
    await check('name').isLength({ min: 5 }).withMessage('User name should contain at least five characters').run(req);
    await check('email').isEmail().withMessage('That doesn\'t look like an email').run(req);
    const result = validationResult(req);
    const { id: userId } = req.user;
    const user = await User.findByPk(userId);
    const { name, email } = req.body;
    if (!user) {
        return res.clearCookie('_token').status(200).redirect('/auth/signup');
    }
    /* console.log(userId);
    console.log(user.id);
    console.log(req.user.id);
    console.log(user.id.toString() !== req.user.id.toString()); */
    if (user.id.toString() !== req.user.id.toString()) {
        return res.clearCookie('_token').status(200).redirect('/auth/login');
    }
    if (!result.isEmpty()) {
        return res.render('user/user-profile', {
            page: `User profile - ${user.name}`,
            csrfToken: req.csrfToken(),
            name: user.name,
            email: user.email,
            errors: result.array()
        });
    }

    try {
        user.set({
            name,
            email
        });
        await user.save();
        return res.redirect(`/auth/user-profile`);
    }
    catch (err) {
        console.log(err);
    }

}

const changePassword = async (req, res) => {
    const { id: userId } = req.user;
    const user = await User.findByPk(userId);
    if (!user) {
        return res.clearCookie('_token').status(200).redirect('/auth/signup');
    }
    if (user.id.toString() !== req.user.id.toString()) {
        return res.clearCookie('_token').status(200).redirect('/auth/login');
    }
    res.render('user/change-password', {
        page: `Change Password - ${user.name}`,
        csrfToken: req.csrfToken()
    })
};

const saveNewPassword = async (req, res) => {
    const { id: userId } = req.user;
    const user = await User.findByPk(userId);
    await check('newPassword').isLength({ min: 8 }).withMessage('Password should contain at least 8 characters').run(req);
    const result = validationResult(req);
    if (!user) {
        return res.clearCookie('_token').status(200).redirect('/auth/signup');
    }
    if (user.id.toString() !== req.user.id.toString()) {
        return res.clearCookie('_token').status(200).redirect('/auth/login');
    }
    if (!result.isEmpty()) {
        return res.render('user/change-password', {
            page: `Change Password - ${user.name}`,
            csrfToken: req.csrfToken(),
            errors: result.array()
        });
    }
    const { password, newPassword } = req.body;
    if (!user.verifyPassword(password)) {
        return res.render('user/change-password', {
            page: `Change Password - ${user.name}`,
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Password doesn\'t match to existing password' }]
        })
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.clearCookie('_token').status(200).redirect('/auth/login');
};

export {
    loginForm,
    authenticateUser,
    logOut,
    signupForm,
    registerUser,
    confirmAccount,
    forgotPassword,
    resetPassword,
    verifyToken,
    newPassword,
    userProfile,
    updateInfo,
    changePassword,
    saveNewPassword
}