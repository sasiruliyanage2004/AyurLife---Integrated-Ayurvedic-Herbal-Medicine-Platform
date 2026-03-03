import express from 'express';
import { getArticles, createArticle, publishArticle, getAllArticles, getMyArticles } from '../controllers/knowledgeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getArticles)
    .post(protect, authorize('doctor'), createArticle);

router.route('/my')
    .get(protect, authorize('doctor'), getMyArticles);

router.route('/admin')
    .get(protect, authorize('admin'), getAllArticles);

router.route('/:id/publish')
    .put(protect, authorize('admin'), publishArticle);

export default router;
