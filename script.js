let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart;

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  document.getElementById('transaction-form').addEventListener('submit', addTransaction);
  document.getElementById('type').addEventListener('change', updateButtonLabel);
  document.getElementById('search').addEventListener('input', filterTransactions);
  document.getElementById('filter-type').addEventListener('change', filterTransactions);
  document.getElementById('filter-category').addEventListener('change', filterTransactions);
});

function updateButtonLabel() {
  const type = document.getElementById('type').value;
  const button = document.querySelector('button[type="submit"]');
  button.textContent = type === 'income' ? 'Add Income' : 'Add Expense';
}

function addTransaction(e) {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const desc = document.getElementById('desc').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const error = document.getElementById('error');

  if (!desc || !amount || isNaN(amount) || !date || !type || !category) {
    error.textContent = 'Please fill in all fields correctly.';
    return;
  }

  error.textContent = '';
  const newTxn = {
    id: Date.now(),
    type,
    category,
    date,
    desc,
    amount: parseFloat(amount)
  };

  transactions.push(newTxn);
  saveToLocalStorage();
  updateUI();

  // Clear form
  document.getElementById('transaction-form').reset();
  updateButtonLabel();
}

function updateUI() {
  updateTransactionList();
  updateSummary();
  updateMonthlySummary();
  updateChart();
}

function updateTransactionList(filteredTransactions = null) {
  const list = document.getElementById('list');
  const displayTransactions = filteredTransactions || transactions;
  list.innerHTML = '';
  
  displayTransactions.forEach(txn => {
    const li = document.createElement('li');
    li.className = txn.type;
    li.innerHTML = `
      <div class="transaction-details">
        <div class="transaction-desc">${txn.desc}</div>
        <div class="transaction-meta">${getCategoryName(txn.category)} • ${formatDate(txn.date)}</div>
      </div>
      <div class="transaction-amount">₹${txn.amount.toFixed(2)}</div>
      <button class="delete-btn" onclick="deleteTransaction(${txn.id})">×</button>
    `;
    list.appendChild(li);
  });
}

function updateSummary() {
  const total = document.getElementById('total');
  let totalAmount = 0;
  
  transactions.forEach(txn => {
    totalAmount += txn.type === 'expense' ? -txn.amount : txn.amount;
  });

  total.textContent = totalAmount.toFixed(2);
  total.style.color = totalAmount >= 0 ? '#28a745' : '#dc3545';
}

function updateMonthlySummary() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let monthlyIncome = 0;
  let monthlyExpenses = 0;
  
  transactions.forEach(txn => {
    const txnDate = new Date(txn.date);
    if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
      if (txn.type === 'income') {
        monthlyIncome += txn.amount;
      } else {
        monthlyExpenses += txn.amount;
      }
    }
  });
  
  const monthlyNet = monthlyIncome - monthlyExpenses;
  
  document.getElementById('monthly-income').textContent = monthlyIncome.toFixed(2);
  document.getElementById('monthly-expenses').textContent = monthlyExpenses.toFixed(2);
  document.getElementById('monthly-net').textContent = monthlyNet.toFixed(2);
  document.getElementById('monthly-net').style.color = monthlyNet >= 0 ? '#28a745' : '#dc3545';
}

function updateChart() {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  
  const categoryTotals = {};
  transactions.filter(txn => txn.type === 'expense').forEach(txn => {
    categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
  });
  
  const labels = Object.keys(categoryTotals).map(cat => getCategoryName(cat));
  const data = Object.values(categoryTotals);
  
  if (expenseChart) {
    expenseChart.destroy();
  }
  
  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ₹' + context.parsed.toFixed(2);
            }
          }
        }
      }
    }
  });
}

function filterTransactions() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filterType = document.getElementById('filter-type').value;
  const filterCategory = document.getElementById('filter-category').value;
  
  const filtered = transactions.filter(txn => {
    const matchesSearch = txn.desc.toLowerCase().includes(searchTerm) || 
                         getCategoryName(txn.category).toLowerCase().includes(searchTerm);
    const matchesType = !filterType || txn.type === filterType;
    const matchesCategory = !filterCategory || txn.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  updateTransactionList(filtered);
}

function deleteTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id);
  saveToLocalStorage();
  updateUI();
}

function clearAll() {
  if (confirm('Are you sure you want to clear all transactions?')) {
    transactions = [];
    saveToLocalStorage();
    updateUI();
  }
}

function sortTransactions() {
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveToLocalStorage();
  updateUI();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getCategoryName(category) {
  const names = {
    food: 'Food & Dining',
    transport: 'Transportation',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    bills: 'Bills & Utilities',
    health: 'Health & Fitness',
    education: 'Education',
    salary: 'Salary',
    other: 'Other'
  };
  return names[category] || category;
}

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}