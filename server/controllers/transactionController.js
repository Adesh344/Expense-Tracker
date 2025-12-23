const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { parseCSV, categorizeTransaction } = require('../utils/csvParser');

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const transactions = await parseCSV(req.file.buffer);
    
    if (transactions.length === 0) {
      return res.status(400).json({ message: 'No valid transactions found in CSV' });
    }

    const categories = await Category.find();
    
    const transactionsToSave = transactions.map(t => ({
      userId: req.userId,
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: categorizeTransaction(t.description, categories),
      paymentMethod: t.paymentMethod || 'UPI'
    }));

    await Transaction.insertMany(transactionsToSave);

    res.json({
      message: 'Transactions uploaded successfully',
      count: transactionsToSave.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    const filter = { userId: req.userId };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { userId: req.userId };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(filter);

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      byCategory: {}
    };

    transactions.forEach(t => {
      if (t.type === 'credit') {
        summary.totalIncome += t.amount;
      } else {
        summary.totalExpense += t.amount;
        summary.byCategory[t.category] = (summary.byCategory[t.category] || 0) + t.amount;
      }
    });

    summary.netBalance = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAllTransactions = async (req, res) => {
  try {
    await Transaction.deleteMany({ userId: req.userId });
    res.json({ message: 'All transactions deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};