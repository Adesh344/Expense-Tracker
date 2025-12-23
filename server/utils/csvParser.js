const csv = require('csv-parser');
const { Readable } = require('stream');

exports.parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Handle both formats
          const date = parseDate(
            row.Date || row.date || row.DATE || 
            row.TransactionDate || row['Transaction Date']
          );
          
          const description = 
            row.Description || row.description || 
            row.Narration || row.DESCRIPTION || 
            row.Particulars || '';

          let amount = 0;
          let type = 'debit';

          // Check if there's a direct amount column
          if (row.amount || row.Amount || row.AMOUNT) {
            amount = parseAmount(row.amount || row.Amount || row.AMOUNT);
            // Determine type from amount sign or separate type column
            if (amount < 0) {
              amount = Math.abs(amount);
              type = 'debit';
            } else {
              type = 'credit';
            }
          } else {
            // Check for separate debit/credit columns
            const debitAmount = parseAmount(
              row['Debit Amount'] || row.Debit || row.debit || row.DEBIT || ''
            );
            const creditAmount = parseAmount(
              row['Credit Amount'] || row.Credit || row.credit || row.CREDIT || ''
            );

            if (debitAmount > 0) {
              amount = debitAmount;
              type = 'debit';
            } else if (creditAmount > 0) {
              amount = creditAmount;
              type = 'credit';
            }
          }

          const transaction = {
            date: date,
            description: description,
            amount: amount,
            type: type,
            paymentMethod: 
              row['Payment Method'] || row.payment_method || 
              row.Method || row.PaymentMode || 'UPI'
          };

          if (transaction.date && transaction.description && transaction.amount > 0) {
            transactions.push(transaction);
          }
        } catch (error) {
          console.error('Error parsing row:', error);
        }
      })
      .on('end', () => resolve(transactions))
      .on('error', reject);
  });
};

function parseDate(dateString) {
  if (!dateString) return null;
  
  // Try various date formats
  let date = new Date(dateString);
  
  // If invalid, try DD/MM/YYYY format
  if (isNaN(date.getTime())) {
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
      // Try DD/MM/YYYY
      date = new Date(parts[2], parts[1] - 1, parts[0]);
      if (isNaN(date.getTime())) {
        // Try MM/DD/YYYY
        date = new Date(parts[2], parts[0] - 1, parts[1]);
      }
    }
  }
  
  return isNaN(date.getTime()) ? null : date;
}

function parseAmount(amountString) {
  if (!amountString) return 0;
  
  const cleaned = amountString.toString().replace(/[₹,\s]/g, '');
  const amount = parseFloat(cleaned);
  
  return isNaN(amount) ? 0 : Math.abs(amount);
}

exports.categorizeTransaction = (description, categories) => {
  const desc = description.toLowerCase();
  
  for (const category of categories) {
    if (category.name === 'Other') continue;
    
    for (const keyword of category.keywords) {
      if (desc.includes(keyword)) {
        return category.name;
      }
    }
  }
  
  return 'Other';
};