// common use routes
import express from 'express';
import { home, filterByCategory, notFound, search } from '../controllers/appController.js';


const router = express.Router();

// Home page
router.get('/', home);
// categories
router.get('/categories/:id', filterByCategory);
// page 404
router.get('/404', notFound);
// searcher
router.post('/search', search);

export default router;
