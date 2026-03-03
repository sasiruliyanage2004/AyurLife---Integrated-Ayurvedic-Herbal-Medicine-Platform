import express from 'express';
import { getQuestions, askQuestion, answerQuestion, moderateQuestion, getAllQuestions } from '../controllers/forumController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getQuestions)
    .post(protect, askQuestion);

router.route('/admin')
    .get(protect, authorize('admin'), getAllQuestions);

router.route('/:id/answer')
    .post(protect, answerQuestion);

router.route('/:id/moderate')
    .put(protect, authorize('admin'), moderateQuestion);

export default router;
