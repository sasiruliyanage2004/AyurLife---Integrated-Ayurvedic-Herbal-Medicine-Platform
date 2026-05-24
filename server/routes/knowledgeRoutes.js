import express from 'express';
import { getKnowledgeArticles, createKnowledgeArticle, getMyKnowledgeArticles, publishKnowledgeArticle, getAllKnowledgeArticlesForAdmin, deleteKnowledgeArticle } from '../controllers/knowledgeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getKnowledgeArticles)
    .post(protect, createKnowledgeArticle);

router.get('/all', protect, authorize('admin'), getAllKnowledgeArticlesForAdmin);
router.get('/my', protect, getMyKnowledgeArticles);
router.put('/:id/publish', protect, authorize('admin'), publishKnowledgeArticle);
router.delete('/:id', protect, deleteKnowledgeArticle);

export default router;
