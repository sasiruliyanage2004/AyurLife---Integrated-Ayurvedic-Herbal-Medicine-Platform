import { Formulation, Batch } from '../models/Production.js';
import User from '../models/User.js';

// --- FORMULATIONS ---

// @desc    Get all formulations
// @route   GET /api/production/formulas
// @access  Private (Producer, Doctor)
const getFormulations = async (req, res) => {
    try {
        const formulas = await Formulation.find({}).populate('producer', 'name');
        res.json(formulas);
    } catch (error) {
        console.error('getFormulations error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new formulation
// @route   POST /api/production/formulas
// @access  Private (Producer)
const createFormulation = async (req, res) => {
    const { name, type, ingredients, method, productionTimeDays } = req.body;

    try {
        const formula = new Formulation({
            producer: req.user._id,
            name,
            type,
            ingredients,
            method,
            productionTimeDays
        });

        const createdFormula = await formula.save();
        res.status(201).json(createdFormula);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- BATCHES ---

// @desc    Get all batches
// @route   GET /api/production/batches
// @access  Private (Producer)
const getBatches = async (req, res) => {
    try {
        // Only show batches if associated with formulas created by this producer?
        // Or all batches if this user is a producer. For simplicity, all batches.
        const batches = await Batch.find({}).populate('formulation');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new batch
// @route   POST /api/production/batches
// @access  Private (Producer)
const createBatch = async (req, res) => {
    const { formulationId, batchNumber, quantityProduced } = req.body;

    try {
        const batch = new Batch({
            formulation: formulationId,
            batchNumber,
            quantityProduced,
            startDate: Date.now(),
            status: 'fermenting' // Default initial status
        });

        const createdBatch = await batch.save();
        res.status(201).json(createdBatch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update batch status/log
// @route   PUT /api/production/batches/:id
// @access  Private (Producer)
const updateBatch = async (req, res) => {
    const { status, qualityNote, batchNumber, quantityProduced } = req.body;

    try {
        const batch = await Batch.findById(req.params.id);

        if (batch) {
            // Check if formulation exists
            const formulation = await Formulation.findById(batch.formulation);
            if (!formulation) {
                return res.status(404).json({ message: 'Formulation not found for this batch' });
            }

            if (status) batch.status = status;
            if (batchNumber) batch.batchNumber = batchNumber;
            if (quantityProduced) batch.quantityProduced = quantityProduced;

            if (qualityNote) {
                batch.qualityLogs.push({
                    note: qualityNote,
                    checkedBy: req.user.name
                });
            }

            const updatedBatch = await batch.save();
            res.json(updatedBatch);
        } else {
            res.status(404).json({ message: 'Batch not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get formulas for logged in producer
// @route   GET /api/production/my-formulas
// @access  Private/Producer
const getMyFormulations = async (req, res) => {
    try {
        const formulas = await Formulation.find({ producer: req.user._id }).populate('producer', 'name');
        res.json(formulas);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get batches for logged in producer
// @route   GET /api/production/my-batches
// @access  Private/Producer
const getMyBatches = async (req, res) => {
    try {
        // First find formulas by this producer
        const formulas = await Formulation.find({ producer: req.user._id });
        const formulaIds = formulas.map(f => f._id);

        // Then find batches linked to those formulas
        const batches = await Batch.find({ formulation: { $in: formulaIds } }).populate('formulation');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete batch
// @route   DELETE /api/production/batches/:id
// @access  Private (Producer)
const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);

        if (batch) {
            // Check if formulation exists
            const formulation = await Formulation.findById(batch.formulation);

            if (!formulation) {
                return res.status(404).json({ message: 'Formulation not found' });
            }

            await batch.deleteOne();
            res.json({ message: 'Batch removed' });
        } else {
            res.status(404).json({ message: 'Batch not found' });
        }
    } catch (error) {
        console.error('deleteBatch error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete formulation
// @route   DELETE /api/production/formulas/:id
// @access  Private (Producer)
const deleteFormulation = async (req, res) => {
    try {
        const formula = await Formulation.findById(req.params.id);

            if (formula) {

            // Check if recipe is used in any batches
            const batchesCount = await Batch.countDocuments({ formulation: req.params.id });
            if (batchesCount > 0) {
                return res.status(400).json({ message: 'Cannot delete recipe that is used in production batches' });
            }

            await formula.deleteOne();
            res.json({ message: 'Recipe removed' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('deleteFormulation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export {
    getFormulations,
    createFormulation,
    getBatches,
    createBatch,
    updateBatch,
    getMyFormulations,
    getMyBatches,
    deleteBatch,
    deleteFormulation
};
