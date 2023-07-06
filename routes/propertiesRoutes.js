import express from 'express';
import { body } from 'express-validator';
import { admin, create, save, addPicture, savePicture, edit, saveChanges, deleteProperty, showProperty, sendMessage, seeMessages, updateState } from '../controllers/propertiesController.js';
import protectRoute from '../middleware/protectRoute.js';
import upload from '../middleware/uploadPicture.js';
import identifyUser from '../middleware/identifyUser.js';


const router = express.Router();

router.get('/my-properties', protectRoute, admin);
router.get('/properties/create', protectRoute, create);
// otra forma de hacer validaciones, pero ahora desde los routes en lugar del controller,
// y los resultados se enviarán al controller
router.post('/properties/create',
    protectRoute,
    body('title').notEmpty().withMessage('Title field can not be empty'),
    body('description')
        .notEmpty().withMessage('Description field can not be empty')
        .isLength({ max: 200 }).withMessage('Description is too long (max: 200 charaters)'),
    body('category').isNumeric().withMessage('Choose a Category'),
    body('price').isNumeric().withMessage('Choose a Price'),
    body('rooms').isNumeric().withMessage('Please choose the number of Rooms'),
    body('parking').isNumeric().withMessage('Please choose the number of Parking'),
    body('wc').isNumeric().withMessage('Please choose the number of Wc'),
    body('lat').notEmpty().withMessage('Please set the location of the property on the map'),
    save
);
router.get('/properties/add-picture/:id', protectRoute, addPicture);
router.post('/properties/add-picture/:id', protectRoute,
    // supports many files
    // upload.array();
    upload.single('picture'),
    savePicture
);
router.get('/properties/edit/:id',
    protectRoute,
    edit
);
router.post('/properties/edit/:id',
    protectRoute,
    body('title').notEmpty().withMessage('Title field can not be empty'),
    body('description')
        .notEmpty().withMessage('Description field can not be empty')
        .isLength({ max: 200 }).withMessage('Description is too long (max: 200 charaters)'),
    body('categoryId').isNumeric().withMessage('Choose a Category'),
    body('priceId').isNumeric().withMessage('Choose a Price'),
    body('rooms').isNumeric().withMessage('Please choose the number of Rooms'),
    body('parking').isNumeric().withMessage('Please choose the number of Parking'),
    body('wc').isNumeric().withMessage('Please choose the number of Wc'),
    body('lat').notEmpty().withMessage('Please set the location of the property on the map'),
    saveChanges
);
router.post('/properties/delete/:id',
    protectRoute,
    deleteProperty
);

// updata property state
router.put('/properties/:id', protectRoute, updateState);

// Public Area

router.get('/property/:id',
    identifyUser,
    showProperty
);

// store messages
router.post('/property/:id',
    identifyUser,
    body('message').isLength({ min: 10 }).withMessage('Message should contain at least 10 characteres'),
    sendMessage
)

// see messages

router.get('/see-messages/:id',
    protectRoute,
    seeMessages
);

export default router;