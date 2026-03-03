import mongoose from 'mongoose';

const knowledgeArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Remedies', 'Plants', 'General']
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [String]
}, {
    timestamps: true
});

const KnowledgeArticle = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
export default KnowledgeArticle;
