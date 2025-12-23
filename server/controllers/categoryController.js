const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find();
    
    if (categories.length === 0) {
      categories = await Category.insertMany(Category.defaultCategories);
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.initializeCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(Category.defaultCategories);
      console.log('Default categories initialized');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};