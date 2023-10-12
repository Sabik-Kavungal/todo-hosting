const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db'); // Import your MongoDB connection
const User = require('./model'); // Import the Mongoose model

const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 6000;

app.use(bodyParser.json());

// Create a new user
app.post('/users', (req, res) => {
  const newUser = new User(req.body);

  newUser.save()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
});

// Get all users
app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  User.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send(); // 204 No Content response for successful deletion
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
