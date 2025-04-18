const Calculation = require('../models/calculationModel');
const Favorite = require('../models/favoriteModel');
const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const calculationController = {
  getAll: async (req, res) => {
    try {
      const calculations = await Calculation.getAll(req.user.id);
      res.json(calculations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch calculations' });
    }
  }, 
  getById:  async (req, res) => {
    try {
      const calculation = await Calculation.getById(req.params.id, req.user.id);
      if (!calculation) {
        return res.status(404).json({ error: 'Calculation not found' });
      }
      res.json(calculation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving calculation' });
    }
  }, 
  create: async (req, res) => {
    try {
      const { name, data } = req.body;
      const id = await Calculation.create(name, data, req.user.id);
      res.status(201).json({ id });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error creating calculation' });
    }
  }, 
  update: async (req, res) => {
    try {
      const { name, data } = req.body;
      const updated = await Calculation.update(req.params.id, name, data, req.user.id);
      if (!updated) {
        return res.status(404).json({ error: 'Calculation not found or unauthorized' });
      }
      res.json({ message: 'Calculation updated' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error updating calculation' });
    }
  }, 
  remove: async (req, res) => {
    try {
      const deleted = await Calculation.remove(req.params.id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Calculation not found or unauthorized' });
      }
      res.json({ message: 'Calculation deleted' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error deleting calculation' });
    }
  }
}


// Favorite Controller
const favoriteController = {
  getAll: async (req, res) => {
    try {
      const favorites = await Favorite.getAll(req.user.id);
      res.json(favorites);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  }, 
  getById: async (req, res) => {
  try {
    const favorite = await Favorite.getById(req.params.id, req.user.id);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving favorite' });
  }
},
add: async (req, res) => {
  try {
    const { calculationId } = req.body;
    const id = await Favorite.add(req.user.id, calculationId);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error adding favorite' });
  }
},
remove: async (req, res) => {
  try {
    const deleted = await Favorite.remove(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found or unauthorized' });
    }
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error removing favorite' });
  }
},
}

// Feedback Controller
const feedbackController = {
  getAll: async (req, res) => {
    try {  
      const feedbacks = await Feedback.getAll();
      res.render('feedback', { feedbacks });
    } catch (err) {
      console.error(err);
      res.status(500).render('feedback', { error: 'Failed to fetch feedback' });
    }
  },

  getById: async (req, res) => {
    try {
      const feedback = await Feedback.getById(req.params.id, req.user.id);
      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      res.json(feedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving feedback' });
    }
  },
  
  add: async (req, res) => {
    const { topic = '', message = '', isABug } = req.body;
    try {
      if (!message || !topic) {
        return res
          .status(400)
          .render('feedback', { error: 'Message and topic are required', topic: topic || '', message: message || '' });
      }
      const userId = res.locals.user?.id;
      if (!userId) {
        return res
          .status(401)
          .render('feedback', { error: 'Unauthorized. Please log in.', topic: topic || '', message: message || '' });
      }
      await Feedback.add(userId, topic, message, isABug ? 1 : 0);
      res.redirect('/feedback');
    } catch (err) {
      console.error(err);
      res.status(500).render('feedback', {
        error: 'Error adding feedback',
        topic: topic || '',
        message: message || '',
      });
    }
  },

  updateResolution: async (req, res) => {
    try {
      const { resolved } = req.body;
      const updated = await Feedback.updateResolution(req.params.id, req.user.id, resolved);
      if (!updated) {
        return res.status(404).json({ error: 'Feedback not found or unauthorized' });
      }
      res.json({ message: 'Feedback updated' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error updating feedback resolution' });
    }
  },
  remove: async (req, res) => {
    try {
      const deleted = await Feedback.remove(req.params.id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Feedback not found or unauthorized' });
      }
      res.json({ message: 'Feedback removed' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error removing feedback' });
    }
  },    
};

// User Controller
const userController = {
  getAll: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },
  getById: async (req, res) => {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving user' });
    }
  },  
  update: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const updated = await User.update(req.params.id, username, email, password);
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error updating user' });
    }
  },
  remove: async (req, res) => {
    try {
      const deleted = await User.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error removing user' });
    }
  },
};

// Export all controller functions
module.exports = {
  calculationController,
  favoriteController,
  feedbackController,
  userController
};
