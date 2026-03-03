import mongoose from 'mongoose';

const forumQuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'flagged'],
        default: 'open'
    },
    answers: [{
        answeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Can be Doctor or Admin
        },
        content: String,
        isVerified: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const ForumQuestion = mongoose.model('ForumQuestion', forumQuestionSchema);
export default ForumQuestion;
