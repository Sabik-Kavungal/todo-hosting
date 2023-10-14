const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sabik:sabik@cluster0.y5doltf.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});


module.exports = mongoose;
