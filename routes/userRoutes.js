import express from 'express';
import { loginForm, authenticateUser, logOut, signupForm, forgotPassword, registerUser, confirmAccount, resetPassword, verifyToken, newPassword, userProfile, updateInfo, changePassword, saveNewPassword } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Routing, son las rutas por las que el usuario podrá navegar
// Asociando rutas al objeto router
/* router.get('/', (req, res) => {
    res.send('Hello world');
});

router.get('/about', (requ, res) => {
    res.sendFile('D:\\Cursos\\Udemy\\Node.js - Bootcamp Desarrollo Web inc. MVC y REST APIs\\BIENESRAICES_MVC\\index.html');
}); */

/* Cuando se tienen urls identicas pero que responden a
peticiones diferentes se pueden englobar de la siguiente manera
gracias a ésto puedes tener url's identicas y reaccionar a
diferentes verbos HTTP
router.route('/')
    .get((req, res) => {
        res.json({ msg: 'Hello world from express' })
    })
    .post((req, res) => {
        res.json({ msg: 'Response from POST' })
    }) 
*/
// Get login view
router.get('/login', loginForm);

// Post data form login view form
router.post('/login', authenticateUser);

// Log out
router.post('/logout', logOut);

// Get signup view
router.get('/signup', signupForm);

// Post data from signup view form
router.post('/signup', registerUser);

// End point for account confirmation
router.get('/confirm/:token', confirmAccount);

// Get forgot-password view
router.get('/forgot-password', forgotPassword);

// Post data from forgot-password view form
router.post('/forgot-password', resetPassword);

// Restore password
// get restore password view 
router.get('/forgot-password/:token', verifyToken);

// Post data from restore password view
router.post('/forgot-password/:token', newPassword);

// See user profile
router.get('/user-profile', protectRoute, userProfile);
// post user profile edited data
router.post('/user-profile', protectRoute, updateInfo);

// change password
router.get('/change-password', protectRoute, changePassword);
// Post new password
router.post('/change-password', protectRoute, saveNewPassword);
export default router;
