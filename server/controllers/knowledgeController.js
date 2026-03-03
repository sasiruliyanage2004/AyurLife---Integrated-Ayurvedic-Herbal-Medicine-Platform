import KnowledgeArticle from '../models/KnowledgeArticle.js';
import Doctor from '../models/Doctor.js';

// @desc    Get all published articles
// @route   GET /api/knowledge
// @access  Public
const getArticles = async (req, res) => {
    try {
        const articles = await KnowledgeArticle.find({ status: 'published' }).populate('author', 'user').populate({
            path: 'author',
            populate: { path: 'user', select: 'name' }
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new article (Doctor only)
// @route   POST /api/knowledge
// @access  Private (Doctor)
const createArticle = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return res.status(403).json({ message: 'Not authorized as a doctor' });
        }

        const { title, content, category, tags } = req.body;
        const article = await KnowledgeArticle.create({
            title,
            content,
            category,
            tags,
            author: doctor._id
        });

        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Publish/Verify article (Admin only)
// @route   PUT /api/knowledge/:id/publish
// @access  Private (Admin)
const publishArticle = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findById(req.params.id);
        if (article) {
            article.status = 'published';
            article.verifiedBy = req.user._id;
            const updatedArticle = await article.save();
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all articles (including drafts - Admin only)
// @route   GET /api/knowledge/admin
// @access  Private (Admin)
const getAllArticles = async (req, res) => {
    try {
        const articles = await KnowledgeArticle.find({}).populate({
            path: 'author',
            populate: { path: 'user', select: 'name' }
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all articles by the logged in doctor
// @route   GET /api/knowledge/my
// @access  Private (Doctor)
const getMyArticles = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return res.status(403).json({ message: 'Not authorized as a doctor' });
        }
        const articles = await KnowledgeArticle.find({ author: doctor._id });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getArticles, createArticle, publishArticle, getAllArticles, getMyArticles };
