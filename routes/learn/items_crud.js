const Item = require('./model');

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new item
const createItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing item
const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an item by ID
const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAllItems = async (req, res) => {
    try {
      await Item.deleteMany();
      res.json({ message: 'All items deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  const addListItems = async (req, res) => {
    try {
      const newItems = await Item.insertMany(req.body);
      res.status(201).json(newItems);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  const updateListItems = async (req, res) => {
    try {
      const updatedItems = await Promise.all(
        req.body.map(async (item) => {
          const updatedItem = await Item.findByIdAndUpdate(item._id, item, { new: true });
          return updatedItem;
        })
      );
  
      res.json(updatedItems);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

  const deleteListItems = async (req, res) => {
    try {
      const deletedItems = await Promise.all(
        req.body.map(async (itemId) => {
          const deletedItem = await Item.findByIdAndDelete(itemId);
          return deletedItem;
        })
      );
  
      res.json(deletedItems);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem ,deleteAllItems,addListItems,updateListItems,deleteListItems};
