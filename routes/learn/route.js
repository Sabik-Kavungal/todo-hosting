const express = require('express');
const router = express.Router();
const itemController = require('./items_crud');

// Get all items
router.get('/item', itemController.getAllItems);

// Get one item by ID
router.get('/:id', itemController.getItemById);

// Create a new item
router.post('/item', itemController.createItem);

// Update an existing item
router.put('/item/:id', itemController.updateItem);

// Delete an item by ID
router.delete('/item/:id', itemController.deleteItem);

router.delete('/item', itemController.deleteAllItems);

router.post('/addListItems', itemController.addListItems);

// Update multiple items
router.put('/updateListItems', itemController.updateListItems);

router.delete('/deleteListItems', itemController.deleteListItems);



module.exports = router;
