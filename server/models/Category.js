const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  keywords: [{
    type: String,
    lowercase: true
  }],
  color: {
    type: String,
    default: '#3B82F6'
  }
});

// Default categories
const defaultCategories = [
  { name: 'Food & Dining', keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'], color: '#EF4444' },
  { name: 'Groceries', keywords: ['grocery', 'supermarket', 'bigbasket', 'dmart', 'reliance fresh', 'more'], color: '#10B981' },
  { name: 'Transportation', keywords: ['uber', 'ola', 'rapido', 'petrol', 'fuel', 'metro', 'bus', 'auto'], color: '#F59E0B' },
  { name: 'Shopping', keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mall', 'store'], color: '#8B5CF6' },
  { name: 'Utilities', keywords: ['electricity', 'water', 'gas', 'internet', 'broadband', 'mobile recharge', 'bill'], color: '#06B6D4' },
  { name: 'Entertainment', keywords: ['movie', 'bookmyshow', 'netflix', 'prime', 'spotify', 'gaming', 'entertainment'], color: '#EC4899' },
  { name: 'Healthcare', keywords: ['pharmacy', 'hospital', 'doctor', 'medical', 'medicine', 'apollo', 'clinic'], color: '#14B8A6' },
  { name: 'Education', keywords: ['school', 'college', 'course', 'book', 'tuition', 'fees', 'education'], color: '#6366F1' },
  { name: 'Other', keywords: [], color: '#6B7280' }
];

module.exports = mongoose.model('Category', categorySchema);
module.exports.defaultCategories = defaultCategories;