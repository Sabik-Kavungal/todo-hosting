const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  gst: { type: Number, default: 0 },
});

const Item = mongoose.model('ItemLern', itemSchema);

module.exports = Item;
