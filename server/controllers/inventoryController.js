import Inventory from '../models/Inventory.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Public (or Private?) - Let's make it private for Doctors/Producers/Suppliers
const getInventory = async (req, res) => {
    try {
        const items = await Inventory.find({}).populate('supplier', 'name email');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get supplier's own inventory
// @route   GET /api/inventory/my
// @access  Private (Supplier)
const getMyInventory = async (req, res) => {
    try {
        const items = await Inventory.find({ supplier: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add inventory item
// @route   POST /api/inventory
// @access  Private (Supplier)
const addInventoryItem = async (req, res) => {
    const { name, scientificName, category, stock, unit, pricePerUnit, expiryDate, image } = req.body;

    try {
        const item = new Inventory({
            supplier: req.user._id,
            name,
            scientificName,
            category,
            stock,
            unit,
            pricePerUnit,
            expiryDate,
            image
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update inventory item (stock/price)
// @route   PUT /api/inventory/:id
// @access  Private (Supplier)
const updateInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (item) {
            if (item.supplier.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            item.name = req.body.name || item.name;
            item.scientificName = req.body.scientificName || item.scientificName;
            item.category = req.body.category || item.category;
            item.stock = req.body.stock !== undefined ? req.body.stock : item.stock;
            item.unit = req.body.unit || item.unit;
            item.pricePerUnit = req.body.pricePerUnit !== undefined ? req.body.pricePerUnit : item.pricePerUnit;
            item.expiryDate = req.body.expiryDate || item.expiryDate;
            item.image = req.body.image || item.image;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Supplier)
const deleteInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (item) {
            if (req.user.role !== 'admin' && item.supplier.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getInventory, getMyInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem };
