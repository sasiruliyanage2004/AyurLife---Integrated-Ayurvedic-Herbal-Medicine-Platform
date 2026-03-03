import ForumQuestion from '../models/ForumQuestion.js';

// @desc    Get all questions
// @route   GET /api/forum
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = await ForumQuestion.find({ status: { $ne: 'flagged' } })
            .populate('askedBy', 'name')
            .populate('answers.answeredBy', 'name role');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Ask a question
// @route   POST /api/forum
// @access  Private
const askQuestion = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const question = await ForumQuestion.create({
            title,
            description,
            category,
            askedBy: req.user._id
        });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Answer a question
// @route   POST /api/forum/:id/answer
// @access  Private (Doctor/Admin for verification)
const answerQuestion = async (req, res) => {
    try {
        const question = await ForumQuestion.findById(req.params.id);
        if (question) {
            const { content } = req.body;
            const isVerified = req.user.role === 'doctor' || req.user.role === 'admin';

            question.answers.push({
                answeredBy: req.user._id,
                content,
                isVerified
            });

            await question.save();
            res.status(201).json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Moderate question (Admin only)
// @route   PUT /api/forum/:id/moderate
// @access  Private (Admin)
const moderateQuestion = async (req, res) => {
    try {
        const { status } = req.body; // 'open', 'closed', 'flagged'
        const question = await ForumQuestion.findById(req.params.id);
        if (question) {
            question.status = status;
            await question.save();
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all questions (including flagged - Admin only)
// @route   GET /api/forum/admin
// @access  Private (Admin)
const getAllQuestions = async (req, res) => {
    try {
        const questions = await ForumQuestion.find({})
            .populate('askedBy', 'name email')
            .populate('answers.answeredBy', 'name role');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getQuestions, askQuestion, answerQuestion, moderateQuestion, getAllQuestions };
